/**
 * Task Service
 * - Create task
 * - Update task
 * - Delete task
 * - Add/toggle/delete checklist item
 * - Add/delete comment
 */

import { Task } from '../models/Task.js';
import { Column } from '../models/Column.js';
import { Comment } from '../models/Comment.js';
import { ITask, IComment, IChecklistItem } from '../types/index.js';

export interface CreateTaskPayload {
  boardId: string;
  columnId: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  createdBy: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assignees?: string[];
  labels?: string[];
}

export class TaskService {
  /**
   * Create new task
   */
  async createTask(payload: CreateTaskPayload): Promise<ITask> {
    const column = await Column.findById(payload.columnId);
    if (!column) {
      throw new Error('Column not found');
    }

    const taskIndex = column.taskIds.length;

    const newTask = new Task({
      ...payload,
      index: taskIndex,
      priority: payload.priority || 'medium',
    });

    await newTask.save();

    // Add task to column
    column.taskIds.push(newTask._id.toString());
    await column.save();

    return newTask.toObject();
  }

  /**
   * Update task
   */
  async updateTask(
    taskId: string,
    payload: UpdateTaskPayload
  ): Promise<ITask | null> {
    const task = await Task.findByIdAndUpdate(taskId, payload, {
      new: true,
    });

    return task ? task.toObject() : null;
  }

  /**
   * Delete task
   */
  async deleteTask(taskId: string): Promise<void> {
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    // Remove from column
    await Column.findByIdAndUpdate(task.columnId, {
      $pull: { taskIds: taskId },
    });

    // Delete all comments for this task
    await Comment.deleteMany({ taskId });
  }

  /**
   * Add checklist item
   */
  async addChecklistItem(
    taskId: string,
    text: string
  ): Promise<IChecklistItem | null> {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const newItem = {
      _id: new Date().getTime().toString(),
      text,
      done: false,
    } as IChecklistItem;

    task.checklist.push(newItem);
    await task.save();

    return newItem;
  }

  /**
   * Toggle checklist item
   */
  async toggleChecklistItem(
    taskId: string,
    itemId: string
  ): Promise<IChecklistItem | null> {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const item = task.checklist.find((i) => i._id.toString() === itemId);
    if (!item) {
      throw new Error('Checklist item not found');
    }

    item.done = !item.done;
    await task.save();

    return item;
  }

  /**
   * Delete checklist item
   */
  async deleteChecklistItem(taskId: string, itemId: string): Promise<void> {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    task.checklist = task.checklist.filter(
      (i) => i._id.toString() !== itemId
    );
    await task.save();
  }

  /**
   * Add comment
   */
  async addComment(
    taskId: string,
    userId: string,
    content: string
  ): Promise<IComment> {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const newComment = new Comment({
      taskId,
      userId,
      content,
    });

    await newComment.save();

    // Add to task
    task.commentIds.push(newComment._id.toString());
    await task.save();

    return newComment.toObject();
  }

  /**
   * Delete comment
   */
  async deleteComment(commentId: string): Promise<void> {
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    // Remove from task
    await Task.findByIdAndUpdate(comment.taskId, {
      $pull: { commentIds: commentId },
    });
  }
}

export default new TaskService();
