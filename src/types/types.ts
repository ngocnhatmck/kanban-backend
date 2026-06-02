export type Priority = 'low' | 'medium' | 'high';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  labels: string[];
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  columns: Column[];
  tasks: Record<string, Task>;
}

export interface Workspace {
  id: string;
  title: string;
  description?: string;
  boards: Board[];
  createdAt: string;
}
