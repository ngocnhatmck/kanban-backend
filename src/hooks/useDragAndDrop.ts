import { useState, useCallback } from 'react';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import type { Task } from '../types/types';
import { useBoardStore } from './useBoardStore';

interface UseDragAndDropReturn {
  activeTask: Task | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

/**
 * Custom hook that encapsulates all drag-and-drop logic for the Kanban board.
 *
 * Data contract expected from draggable/droppable items:
 *  - Task draggables must set `data: { type: 'task', task, columnId }`
 *  - Column droppables must set `data: { type: 'column', columnId }`
 *  - Task droppables (sortable) must set `data: { type: 'task', task, columnId }`
 */
export function useDragAndDrop(): UseDragAndDropReturn {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const moveTask = useBoardStore((state) => state.moveTask);
  const getActiveBoard = useBoardStore((state) => state.getActiveBoard);

  const findColumnByTaskId = useCallback(
    (taskId: string): string | undefined => {
      const board = getActiveBoard();
      if (!board) return undefined;
      const column = board.columns.find((col) => col.taskIds.includes(taskId));
      return column?.id;
    },
    [getActiveBoard]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent): void => {
      const { active } = event;
      const activeData = active.data.current as
        | { type: string; task: Task; columnId: string }
        | undefined;

      if (activeData?.type === 'task') {
        setActiveTask(activeData.task);
        return;
      }

      // Fallback: look up the task from the store if data wasn't attached
      const board = getActiveBoard();
      if (board) {
        const task = board.tasks[active.id as string];
        if (task) {
          setActiveTask(task);
        }
      }
    },
    [getActiveBoard]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent): void => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const board = getActiveBoard();
      if (!board) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const activeData = active.data.current as
        | { type: string; columnId: string }
        | undefined;
      const overData = over.data.current as
        | { type: string; columnId: string }
        | undefined;

      // Determine source column
      const fromColumnId = activeData?.columnId ?? findColumnByTaskId(activeId);
      if (!fromColumnId) return;

      // Determine destination column
      let toColumnId: string | undefined;

      if (overData?.type === 'column') {
        // Dropping directly onto a column droppable
        toColumnId = overData.columnId ?? overId;
      } else if (overData?.type === 'task') {
        // Dropping onto another task — use that task's column
        toColumnId = overData.columnId ?? findColumnByTaskId(overId);
      } else {
        // Fallback: check if overId is a column id
        const isColumn = board.columns.some((col) => col.id === overId);
        toColumnId = isColumn ? overId : findColumnByTaskId(overId);
      }

      if (!toColumnId || fromColumnId === toColumnId) return;

      const fromColumn = board.columns.find((c) => c.id === fromColumnId);
      const toColumn = board.columns.find((c) => c.id === toColumnId);
      if (!fromColumn || !toColumn) return;

      const fromIndex = fromColumn.taskIds.indexOf(activeId);
      if (fromIndex === -1) return;

      // Determine insertion index in the target column
      let toIndex: number;

      if (overData?.type === 'task') {
        // Insert at the position of the task we're hovering over
        const overTaskIndex = toColumn.taskIds.indexOf(overId);
        toIndex = overTaskIndex >= 0 ? overTaskIndex : toColumn.taskIds.length;
      } else {
        // Dropping on the column itself — append to end
        toIndex = toColumn.taskIds.length;
      }

      moveTask(activeId, fromColumnId, toColumnId, fromIndex, toIndex);
    },
    [getActiveBoard, findColumnByTaskId, moveTask]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent): void => {
      const { active, over } = event;

      setActiveTask(null);

      if (!over || active.id === over.id) return;

      const board = getActiveBoard();
      if (!board) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const activeData = active.data.current as
        | { type: string; columnId: string }
        | undefined;
      const overData = over.data.current as
        | { type: string; columnId: string }
        | undefined;

      const fromColumnId = activeData?.columnId ?? findColumnByTaskId(activeId);
      if (!fromColumnId) return;

      let toColumnId: string | undefined;

      if (overData?.type === 'column') {
        toColumnId = overData.columnId ?? overId;
      } else if (overData?.type === 'task') {
        toColumnId = overData.columnId ?? findColumnByTaskId(overId);
      } else {
        const isColumn = board.columns.some((col) => col.id === overId);
        toColumnId = isColumn ? overId : findColumnByTaskId(overId);
      }

      if (!toColumnId) return;

      // Only handle same-column reorder here; cross-column was handled in dragOver
      if (fromColumnId !== toColumnId) return;

      const column = board.columns.find((c) => c.id === fromColumnId);
      if (!column) return;

      const fromIndex = column.taskIds.indexOf(activeId);
      const overIndex = column.taskIds.indexOf(overId);

      if (fromIndex === -1 || overIndex === -1 || fromIndex === overIndex) return;

      moveTask(activeId, fromColumnId, toColumnId, fromIndex, overIndex);
    },
    [getActiveBoard, findColumnByTaskId, moveTask]
  );

  return {
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
