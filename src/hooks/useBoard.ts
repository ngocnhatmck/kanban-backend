/**
 * Custom Hook: useBoard
 * Quản lý board state với Optimistic UI + API integration
 * - Fetch board từ API
 * - Reorder task với Optimistic Update (cập nhật UI ngay, sau đó call API)
 * - Handle error & rollback nếu API thất bại
 */

import { useState, useCallback, useEffect } from 'react';
import boardApi from '../api/board';
import type { Board, ReorderTaskRequest } from '../types';
import { useSocket } from './useSocket';

interface UseBoardState {
  board: Board | null;
  isLoading: boolean;
  error: Error | null;
  isReordering: boolean;
}

export function useBoard(boardId: string) {
  const [state, setState] = useState<UseBoardState>({
    board: null,
    isLoading: true,
    error: null,
    isReordering: false,
  });

  // Lưu previous state để rollback nếu API thất bại
  const [previousBoard, setPreviousBoard] = useState<Board | null>(null);

  // Fetch board từ API khi component mount
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const response = await boardApi.getBoardById(boardId);
        setState((prev) => ({
          ...prev,
          board: response.data,
          isLoading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err : new Error('Unknown error'),
          isLoading: false,
        }));
      }
    };

    fetchBoard();
  }, [boardId]);

  /**
   * Reorder task với Optimistic UI
   * 1. Lưu state cũ
   * 2. Update UI ngay lập tức (optimistic update)
   * 3. Call API
   * 4. Nếu API thất bại -> rollback
   */
  const reorderTask = useCallback(
    async (payload: ReorderTaskRequest) => {
      if (!state.board) return;

      // Save previous state
      setPreviousBoard(state.board);

      try {
        setState((prev) => ({ ...prev, isReordering: true }));

        // Perform optimistic update
        const newBoard = JSON.parse(JSON.stringify(state.board)) as Board;
        const fromColumn = newBoard.columns.find(
          (col) => col.id === payload.fromColumnId
        );
        const toColumn = newBoard.columns.find(
          (col) => col.id === payload.toColumnId
        );

        if (fromColumn && toColumn) {
          // Remove task from source column
          fromColumn.taskIds.splice(payload.fromIndex, 1);

          // Add task to target column
          toColumn.taskIds.splice(payload.toIndex, 0, payload.taskId);

          // Update UI immediately (optimistic)
          setState((prev) => ({
            ...prev,
            board: newBoard,
          }));

          // Call API
          const response = await boardApi.reorderTask(boardId, payload);

          // Update with server response
          setState((prev) => ({
            ...prev,
            board: response.data,
            isReordering: false,
          }));

          console.log('✅ Task reordered successfully');
        }
      } catch (error) {
        // Rollback to previous state if API fails
        console.error('❌ Failed to reorder task:', error);
        setState((prev) => ({
          ...prev,
          board: previousBoard,
          isReordering: false,
          error:
            error instanceof Error
              ? error
              : new Error('Failed to reorder task'),
        }));
      }
    },
    [state.board, previousBoard, boardId]
  );

  /**
   * Refetch board từ API
   */
  const refetchBoard = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await boardApi.getBoardById(boardId);
      setState((prev) => ({
        ...prev,
        board: response.data,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err : new Error('Unknown error'),
        isLoading: false,
      }));
    }
  }, [boardId]);

  // Lắng nghe sự kiện Real-time từ Socket
  useSocket(boardId, refetchBoard);

  return {
    board: state.board,
    isLoading: state.isLoading,
    error: state.error,
    reorderTask,
    isReordering: state.isReordering,
    refetchBoard,
  };
}

export default useBoard;
