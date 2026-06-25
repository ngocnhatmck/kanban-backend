/**
 * Types & Interfaces cho Backend
 * (Tương tự Frontend nhưng có thêm các fields internal)
 */

// ============================================================================
// USER
// ============================================================================

export interface IUser {
  _id: string;
  email: string;
  password: string; // Hashed password
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserPayload = Omit<IUser, 'password' | '_id' | 'createdAt' | 'updatedAt'>;

// ============================================================================
// PROJECT & MEMBER
// ============================================================================

export interface IProjectMember {
  userId: string;
  email: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}

export interface IProject {
  _id: string;
  title: string;
  description?: string;
  ownerId: string; // User ID
  members: IProjectMember[];
  boards: string[]; // Board IDs
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// BOARD & COLUMN
// ============================================================================

export interface IColumn {
  _id: string;
  boardId: string;
  title: string;
  index: number;
  taskIds: string[]; // Task IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface IBoard {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  columns: string[]; // Column IDs
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TASK & CHECKLIST
// ============================================================================

export type Priority = 'low' | 'medium' | 'high';

export interface IChecklistItem {
  _id: string;
  text: string;
  done: boolean;
}

export interface ITask {
  _id: string;
  boardId: string;
  columnId: string;
  title: string;
  description?: string;
  priority: Priority;
  assignees: string[]; // User IDs
  labels: string[];
  checklist: IChecklistItem[];
  commentIds: string[]; // Comment IDs
  index: number;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// COMMENT
// ============================================================================

export interface IComment {
  _id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// JWT & AUTH
// ============================================================================

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// ============================================================================
// API REQUEST/RESPONSE
// ============================================================================

export interface ApiResponse<T = any> {
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
