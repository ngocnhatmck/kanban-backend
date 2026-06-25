import { create } from 'zustand';
import type { Board, Priority, Task, Workspace } from '../types/types';
import projectApi from '../api/project';
import boardApi from '../api/board';

// Helper to normalize backend board structure into frontend store structure
const normalizeBoard = (backendBoard: any): Board => {
  const tasks: Record<string, Task> = {};
  const columns = (backendBoard.columns || []).map((col: any) => {
    const taskIds = (col.taskIds || []).map((task: any) => {
      const fTask: Task = {
        id: task._id || task.id,
        title: task.title,
        description: task.description,
        priority: task.priority || 'medium',
        labels: task.labels || [],
        checklist: (task.checklist || []).map((item: any) => ({
          id: item._id || item.id,
          text: item.text,
          done: item.done,
        })),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      };
      tasks[fTask.id] = fTask;
      return fTask.id;
    });

    return {
      id: col._id || col.id,
      title: col.title,
      taskIds,
    };
  });

  return {
    id: backendBoard._id || backendBoard.id,
    title: backendBoard.title,
    description: backendBoard.description,
    columns,
    tasks,
  };
};

interface BoardStoreState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  activeBoardId: string | null;
  isLoading: boolean;

  // Computed getters
  getActiveWorkspace: () => Workspace | undefined;
  getActiveBoard: () => Board | undefined;

  // Sync actions
  fetchWorkspaces: () => Promise<void>;
  fetchActiveBoard: () => Promise<void>;

  // Workspace actions
  setActiveWorkspace: (id: string) => void;
  addWorkspace: (title: string, description?: string) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;

  // Board actions
  setActiveBoard: (id: string) => void;
  addBoard: (workspaceId: string, title: string, description?: string) => Promise<void>;

  // Column actions
  addColumn: (title: string) => Promise<void>;

  // Task actions
  addTask: (columnId: string, title: string, priority: Priority) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTask: (_columnId: string, taskId: string) => Promise<void>;
  moveTask: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    fromIndex: number,
    toIndex: number
  ) => Promise<void>;

  // Checklist actions
  addChecklistItem: (taskId: string, text: string) => Promise<void>;
  toggleChecklistItem: (taskId: string, itemId: string) => Promise<void>;
  deleteChecklistItem: (taskId: string, itemId: string) => Promise<void>;
}

export const useBoardStore = create<BoardStoreState>((set, get) => ({
  workspaces: [],
  activeWorkspaceId: null,
  activeBoardId: null,
  isLoading: false,

  getActiveWorkspace: (): Workspace | undefined => {
    const { workspaces, activeWorkspaceId } = get();
    return workspaces.find((ws) => ws.id === activeWorkspaceId);
  },

  getActiveBoard: (): Board | undefined => {
    const workspace = get().getActiveWorkspace();
    if (!workspace) return undefined;
    const { activeBoardId } = get();
    return workspace.boards.find((b) => b.id === activeBoardId);
  },

  // ── Sync Actions ───────────────────────────────────────────────────────
  fetchWorkspaces: async () => {
    try {
      set({ isLoading: true });
      const response = await projectApi.getProjects(1, 50);
      const resData = (response as any).data?.data || response.data;
      const projects = resData.items || [];
      
      const mappedWorkspaces: Workspace[] = projects.map((proj: any) => ({
        id: proj._id,
        title: proj.title,
        description: proj.description,
        boards: (proj.boards || []).map((b: any) => ({
          id: b._id || b,
          title: b.title || 'Board mặc định',
          description: b.description,
          columns: [],
          tasks: {},
        })),
        createdAt: proj.createdAt,
      }));

      const activeWSId = get().activeWorkspaceId || mappedWorkspaces[0]?.id || null;
      const activeBId = get().activeBoardId || mappedWorkspaces.find(w => w.id === activeWSId)?.boards[0]?.id || null;

      set({
        workspaces: mappedWorkspaces,
        activeWorkspaceId: activeWSId,
        activeBoardId: activeBId,
        isLoading: false,
      });

      if (activeBId) {
        await get().fetchActiveBoard();
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ isLoading: false });
    }
  },

  fetchActiveBoard: async () => {
    const boardId = get().activeBoardId;
    if (!boardId) return;

    try {
      const response = await boardApi.getBoardById(boardId);
      const resData = (response as any).data?.data || response.data;
      
      if (resData) {
        const normalizedBoard = normalizeBoard(resData);
        set((state) => ({
          workspaces: state.workspaces.map((ws) => {
            if (ws.id !== state.activeWorkspaceId) return ws;
            return {
              ...ws,
              boards: ws.boards.map((b) => (b.id === boardId ? normalizedBoard : b)),
            };
          }),
        }));
      }
    } catch (error) {
      console.error('Error fetching board details:', error);
    }
  },

  // ── Workspace ──────────────────────────────────────────────────────────
  setActiveWorkspace: (id: string): void => {
    const workspace = get().workspaces.find((ws) => ws.id === id);
    const firstBoardId = workspace?.boards[0]?.id ?? null;
    set({ activeWorkspaceId: id, activeBoardId: firstBoardId });
    if (firstBoardId) {
      get().fetchActiveBoard();
    }
  },

  addWorkspace: async (title: string, description?: string): Promise<void> => {
    try {
      await projectApi.createProject({ title, description });
      await get().fetchWorkspaces();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  },

  deleteWorkspace: async (id: string): Promise<void> => {
    try {
      await projectApi.deleteProject(id);
      set({ activeWorkspaceId: null, activeBoardId: null });
      await get().fetchWorkspaces();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  },

  // ── Board ──────────────────────────────────────────────────────────────
  setActiveBoard: (id: string): void => {
    set({ activeBoardId: id });
    get().fetchActiveBoard();
  },

  addBoard: async (workspaceId: string, title: string, description?: string): Promise<void> => {
    try {
      await boardApi.createBoard(workspaceId, { title, description });
      await get().fetchWorkspaces();
    } catch (error) {
      console.error('Error creating board:', error);
    }
  },

  // ── Column ─────────────────────────────────────────────────────────────
  addColumn: async (title: string): Promise<void> => {
    const boardId = get().activeBoardId;
    if (!boardId) return;
    try {
      await boardApi.addColumn(boardId, title);
      await get().fetchActiveBoard();
    } catch (error) {
      console.error('Error creating column:', error);
    }
  },

  // ── Task ───────────────────────────────────────────────────────────────
  addTask: async (columnId: string, title: string, priority: Priority): Promise<void> => {
    const boardId = get().activeBoardId;
    if (!boardId) return;
    try {
      await boardApi.createTask(boardId, { title, priority, columnId });
      await get().fetchActiveBoard();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  },

  updateTask: async (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<void> => {
    try {
      await boardApi.updateTask(taskId, updates);
      await get().fetchActiveBoard();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  },

  deleteTask: async (_columnId: string, taskId: string): Promise<void> => {
    try {
      await boardApi.deleteTask(taskId);
      await get().fetchActiveBoard();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  },

  moveTask: async (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    fromIndex: number,
    toIndex: number
  ): Promise<void> => {
    const prevWorkspaces = get().workspaces;
    
    // Optimistic Update
    set((state) => ({
      workspaces: state.workspaces.map((ws) => {
        if (ws.id !== state.activeWorkspaceId) return ws;
        return {
          ...ws,
          boards: ws.boards.map((board) => {
            if (board.id !== state.activeBoardId) return board;
            const newColumns = board.columns.map((col) => ({
              ...col,
              taskIds: [...col.taskIds],
            }));
            const fromColumn = newColumns.find((c) => c.id === fromColumnId);
            const toColumn = newColumns.find((c) => c.id === toColumnId);
            if (!fromColumn || !toColumn) return board;
            fromColumn.taskIds.splice(fromIndex, 1);
            toColumn.taskIds.splice(toIndex, 0, taskId);
            return { ...board, columns: newColumns };
          }),
        };
      }),
    }));

    try {
      const activeBoardId = get().activeBoardId;
      if (!activeBoardId) return;

      const response = await boardApi.reorderTask(activeBoardId, {
        taskId,
        fromColumnId,
        toColumnId,
        fromIndex,
        toIndex,
      });

      const resData = (response as any).data?.data || response.data;
      if (resData) {
        const normalizedBoard = normalizeBoard(resData);
        set((state) => ({
          workspaces: state.workspaces.map((ws) => {
            if (ws.id !== state.activeWorkspaceId) return ws;
            return {
              ...ws,
              boards: ws.boards.map((b) => (b.id === activeBoardId ? normalizedBoard : b)),
            };
          }),
        }));
      }
    } catch (error) {
      console.error('Error reordering task:', error);
      // Rollback on error
      set({ workspaces: prevWorkspaces });
    }
  },

  // ── Checklist ──────────────────────────────────────────────────────────
  addChecklistItem: async (taskId: string, text: string): Promise<void> => {
    try {
      await boardApi.addChecklistItem(taskId, text);
      await get().fetchActiveBoard();
    } catch (error) {
      console.error('Error adding checklist item:', error);
    }
  },

  toggleChecklistItem: async (taskId: string, itemId: string): Promise<void> => {
    try {
      await boardApi.toggleChecklistItem(taskId, itemId);
      await get().fetchActiveBoard();
    } catch (error) {
      console.error('Error toggling checklist item:', error);
    }
  },

  deleteChecklistItem: async (taskId: string, itemId: string): Promise<void> => {
    try {
      await boardApi.deleteChecklistItem(taskId, itemId);
      await get().fetchActiveBoard();
    } catch (error) {
      console.error('Error deleting checklist item:', error);
    }
  },
}));
