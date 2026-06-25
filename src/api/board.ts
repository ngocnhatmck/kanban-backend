/**
 * API Endpoints cho Board & Task Management
 * - Lấy board chi tiết (gồm columns và tasks)
 * - Tạo/cập nhật/xoá task
 * - Reorder task (Drag & Drop)
 * - Quản lý checklist
 */

import axiosClient from './axiosClient';
import type {
  Board,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  ReorderTaskRequest,
  ChecklistItem,
  CreateBoardRequest,
} from '../types';

export const boardApi = {
  /**
   * Lấy chi tiết board (gồm tất cả columns, tasks)
   * Đây là API "Heavy" - trả về toàn bộ cấu trúc board
   */
  getBoardById: (boardId: string) => {
    return axiosClient.get<Board>(`/boards/${boardId}`);
  },

  /**
   * Tạo board mới trong project
   */
  createBoard: (projectId: string, data: CreateBoardRequest) => {
    return axiosClient.post<Board>(`/boards?projectId=${projectId}`, data);
  },

  /**
   * Cập nhật board
   */
  updateBoard: (boardId: string, data: Partial<CreateBoardRequest>) => {
    return axiosClient.put<Board>(`/boards/${boardId}`, data);
  },

  /**
   * Xoá board
   */
  deleteBoard: (boardId: string) => {
    return axiosClient.delete(`/boards/${boardId}`);
  },

  /**
   * Tạo column mới
   */
  addColumn: (boardId: string, title: string) => {
    return axiosClient.post(`/boards/${boardId}/columns`, { title });
  },

  // ========== TASK OPERATIONS ==========

  /**
   * Tạo task mới
   */
  createTask: (boardId: string, data: CreateTaskRequest) => {
    return axiosClient.post<Task>('/tasks', { ...data, boardId });
  },

  /**
   * Cập nhật task
   */
  updateTask: (taskId: string, data: UpdateTaskRequest) => {
    return axiosClient.put<Task>(`/tasks/${taskId}`, data);
  },

  /**
   * Xoá task
   */
  deleteTask: (taskId: string) => {
    return axiosClient.delete(`/tasks/${taskId}`);
  },

  reorderTask: (boardId: string, data: ReorderTaskRequest) => {
    return axiosClient.post<Board>(`/boards/reorder?boardId=${boardId}`, data);
  },

  // ========== CHECKLIST OPERATIONS ==========

  /**
   * Thêm item vào checklist
   */
  addChecklistItem: (taskId: string, text: string) => {
    return axiosClient.post<ChecklistItem>(
      `/tasks/${taskId}/checklist`,
      { text }
    );
  },

  /**
   * Toggle checklist item (done/not done)
   */
  toggleChecklistItem: (taskId: string, itemId: string) => {
    return axiosClient.patch<ChecklistItem>(
      `/tasks/${taskId}/checklist/${itemId}/toggle`,
      {}
    );
  },

  /**
   * Xoá checklist item
   */
  deleteChecklistItem: (taskId: string, itemId: string) => {
    return axiosClient.delete(`/tasks/${taskId}/checklist/${itemId}`);
  },

  // ========== COMMENT OPERATIONS ==========

  /**
   * Thêm comment vào task
   */
  addComment: (taskId: string, content: string) => {
    return axiosClient.post(`/tasks/${taskId}/comments`, { content });
  },

  /**
   * Xoá comment
   */
  deleteComment: (taskId: string, commentId: string) => {
    return axiosClient.delete(`/tasks/${taskId}/comments/${commentId}`);
  },
};

export default boardApi;
