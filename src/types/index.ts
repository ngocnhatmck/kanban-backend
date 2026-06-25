/**
 * Types & Interfaces cho toàn bộ ứng dụng Kanban Board
 * Được sử dụng bởi cả Frontend và Backend
 */

// ============================================================================
// AUTH & USER
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// ============================================================================
// PROJECT & WORKSPACE
// ============================================================================

export interface Project {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  members: ProjectMember[];
  boards: Board[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  userId: string;
  email: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

// ============================================================================
// BOARD & COLUMN
// ============================================================================

export interface Board {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  columns: Column[];
  tasks: Record<string, Task>;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  index: number; // Để sắp xếp thứ tự các cột
  taskIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TASK & CHECKLIST
// ============================================================================

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description?: string;
  priority: Priority;
  assignees: string[]; // User IDs
  labels: string[];
  checklist: ChecklistItem[];
  comments: Comment[];
  index: number; // Để sắp xếp thứ tự các task trong column
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

// ============================================================================
// COMMENT
// ============================================================================

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// DRAG & DROP OPERATIONS
// ============================================================================

export interface DragDropPayload {
  taskId: string;
  fromColumnId: string;
  toColumnId: string;
  fromIndex: number;
  toIndex: number;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================================
// FORM REQUESTS
// ============================================================================

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: Priority;
  columnId: string;
  assignees?: string[];
  labels?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: Priority;
  assignees?: string[];
  labels?: string[];
}

export interface ReorderTaskRequest {
  taskId: string;
  fromColumnId: string;
  toColumnId: string;
  fromIndex: number;
  toIndex: number;
}

export interface CreateBoardRequest {
  title: string;
  description?: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
}

export interface InviteMemberRequest {
  email: string;
  role: 'admin' | 'member';
}
