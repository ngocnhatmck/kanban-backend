import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Board, ChecklistItem, Priority, Task, Workspace } from '../types/types';
import { initialWorkspaces } from '../data/mockData';

interface BoardStoreState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  activeBoardId: string | null;

  // Computed getters
  getActiveWorkspace: () => Workspace | undefined;
  getActiveBoard: () => Board | undefined;

  // Workspace actions
  setActiveWorkspace: (id: string) => void;
  addWorkspace: (title: string, description?: string) => void;
  deleteWorkspace: (id: string) => void;

  // Board actions
  setActiveBoard: (id: string) => void;
  addBoard: (workspaceId: string, title: string, description?: string) => void;

  // Column actions
  addColumn: (title: string) => void;

  // Task actions
  addTask: (columnId: string, title: string, priority: Priority) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  moveTask: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    fromIndex: number,
    toIndex: number
  ) => void;

  // Checklist actions
  addChecklistItem: (taskId: string, text: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  deleteChecklistItem: (taskId: string, itemId: string) => void;
}

export const useBoardStore = create<BoardStoreState>((set, get) => ({
  workspaces: initialWorkspaces,
  activeWorkspaceId: initialWorkspaces[0]?.id ?? null,
  activeBoardId: initialWorkspaces[0]?.boards[0]?.id ?? null,

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

  // ── Workspace ──────────────────────────────────────────────────────────
  setActiveWorkspace: (id: string): void => {
    const state = get();
    const workspace = state.workspaces.find((ws) => ws.id === id);
    const firstBoardId = workspace?.boards[0]?.id ?? null;
    set({ activeWorkspaceId: id, activeBoardId: firstBoardId });
  },

  addWorkspace: (title: string, description?: string): void => {
    const newBoard: Board = {
      id: nanoid(),
      title: 'Board mặc định',
      description: 'Board đầu tiên của workspace',
      columns: [
        { id: nanoid(), title: 'To Do', taskIds: [] },
        { id: nanoid(), title: 'Doing', taskIds: [] },
        { id: nanoid(), title: 'Done', taskIds: [] },
      ],
      tasks: {},
    };
    const newWorkspace: Workspace = {
      id: nanoid(),
      title,
      description,
      boards: [newBoard],
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      workspaces: [...state.workspaces, newWorkspace],
      activeWorkspaceId: newWorkspace.id,
      activeBoardId: newBoard.id,
    }));
  },

  deleteWorkspace: (id: string): void => {
    set((state) => {
      const filtered = state.workspaces.filter((ws) => ws.id !== id);
      const nextActive = filtered[0];
      return {
        workspaces: filtered,
        activeWorkspaceId: nextActive?.id ?? null,
        activeBoardId: nextActive?.boards[0]?.id ?? null,
      };
    });
  },

  // ── Board ──────────────────────────────────────────────────────────────
  setActiveBoard: (id: string): void => {
    set({ activeBoardId: id });
  },

  addBoard: (workspaceId: string, title: string, description?: string): void => {
    const newBoard: Board = {
      id: nanoid(),
      title,
      description,
      columns: [
        { id: nanoid(), title: 'To Do', taskIds: [] },
        { id: nanoid(), title: 'Doing', taskIds: [] },
        { id: nanoid(), title: 'Done', taskIds: [] },
      ],
      tasks: {},
    };
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id !== workspaceId ? ws : { ...ws, boards: [...ws.boards, newBoard] }
      ),
      activeBoardId: newBoard.id,
    }));
  },

  // ── Column ─────────────────────────────────────────────────────────────
  addColumn: (title: string): void => {
    const newColumn = { id: nanoid(), title, taskIds: [] as string[] };
    set((state) => ({
      workspaces: state.workspaces.map((ws) => {
        if (ws.id !== state.activeWorkspaceId) return ws;
        return {
          ...ws,
          boards: ws.boards.map((board) =>
            board.id !== state.activeBoardId
              ? board
              : { ...board, columns: [...board.columns, newColumn] }
          ),
        };
      }),
    }));
  },

  // ── Task ───────────────────────────────────────────────────────────────
  addTask: (columnId: string, title: string, priority: Priority): void => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: nanoid(),
      title,
      priority,
      labels: [],
      checklist: [],
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({
      workspaces: state.workspaces.map((ws) => {
        if (ws.id !== state.activeWorkspaceId) return ws;
        return {
          ...ws,
          boards: ws.boards.map((board) => {
            if (board.id !== state.activeBoardId) return board;
            return {
              ...board,
              tasks: { ...board.tasks, [newTask.id]: newTask },
              columns: board.columns.map((col) =>
                col.id !== columnId
                  ? col
                  : { ...col, taskIds: [...col.taskIds, newTask.id] }
              ),
            };
          }),
        };
      }),
    }));
  },

  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): void => {
    const now = new Date().toISOString();
    set((state) => ({
      workspaces: state.workspaces.map((ws) => {
        if (ws.id !== state.activeWorkspaceId) return ws;
        return {
          ...ws,
          boards: ws.boards.map((board) => {
            if (board.id !== state.activeBoardId) return board;
            const existing = board.tasks[taskId];
            if (!existing) return board;
            return {
              ...board,
              tasks: {
                ...board.tasks,
                [taskId]: { ...existing, ...updates, updatedAt: now },
              },
            };
          }),
        };
      }),
    }));
  },

  deleteTask: (columnId: string, taskId: string): void => {
    set((state) => ({
      workspaces: state.workspaces.map((ws) => {
        if (ws.id !== state.activeWorkspaceId) return ws;
        return {
          ...ws,
          boards: ws.boards.map((board) => {
            if (board.id !== state.activeBoardId) return board;
            const { [taskId]: _removed, ...remainingTasks } = board.tasks;
            return {
              ...board,
              tasks: remainingTasks,
              columns: board.columns.map((col) =>
                col.id !== columnId
                  ? col
                  : { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) }
              ),
            };
          }),
        };
      }),
    }));
  },

  moveTask: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    fromIndex: number,
    toIndex: number
  ): void => {
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
  },

  // ── Checklist ──────────────────────────────────────────────────────────
  addChecklistItem: (taskId: string, text: string): void => {
    const item: ChecklistItem = { id: nanoid(), text, done: false };
    set((state) => ({
      workspaces: state.workspaces.map((ws) => {
        if (ws.id !== state.activeWorkspaceId) return ws;
        return {
          ...ws,
          boards: ws.boards.map((board) => {
            if (board.id !== state.activeBoardId) return board;
            const task = board.tasks[taskId];
            if (!task) return board;
            return {
              ...board,
              tasks: {
                ...board.tasks,
                [taskId]: { ...task, checklist: [...task.checklist, item], updatedAt: new Date().toISOString() },
              },
            };
          }),
        };
      }),
    }));
  },

  toggleChecklistItem: (taskId: string, itemId: string): void => {
    set((state) => ({
      workspaces: state.workspaces.map((ws) => {
        if (ws.id !== state.activeWorkspaceId) return ws;
        return {
          ...ws,
          boards: ws.boards.map((board) => {
            if (board.id !== state.activeBoardId) return board;
            const task = board.tasks[taskId];
            if (!task) return board;
            return {
              ...board,
              tasks: {
                ...board.tasks,
                [taskId]: {
                  ...task,
                  checklist: task.checklist.map((item) =>
                    item.id !== itemId ? item : { ...item, done: !item.done }
                  ),
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),
        };
      }),
    }));
  },

  deleteChecklistItem: (taskId: string, itemId: string): void => {
    set((state) => ({
      workspaces: state.workspaces.map((ws) => {
        if (ws.id !== state.activeWorkspaceId) return ws;
        return {
          ...ws,
          boards: ws.boards.map((board) => {
            if (board.id !== state.activeBoardId) return board;
            const task = board.tasks[taskId];
            if (!task) return board;
            return {
              ...board,
              tasks: {
                ...board.tasks,
                [taskId]: {
                  ...task,
                  checklist: task.checklist.filter((item) => item.id !== itemId),
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),
        };
      }),
    }));
  },
}));
