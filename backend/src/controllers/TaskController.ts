/**
 * Task Controller
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import taskService, {
  CreateTaskPayload,
  UpdateTaskPayload,
} from '../services/TaskService.js';
import { ApiResponse } from '../types/index.js';
import { getIO } from '../utils/socket.js';
import { Task } from '../models/Task.js';

const createTaskSchema = z.object({
  boardId: z.string(),
  columnId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignees: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
});

export class TaskController {
  /**
   * POST /tasks
   * Create new task
   */
  async createTask(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const data = createTaskSchema.parse(req.body);

      const task = await taskService.createTask({
        ...data,
        createdBy: req.user.userId,
      } as CreateTaskPayload);

      try { getIO().to(`board_${task.boardId}`).emit('taskCreated', task); } catch (e) { console.error(e); }

      res.status(201).json({
        success: true,
        data: task,
        message: 'Task created successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create task';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * PUT /tasks/:id
   * Update task
   */
  async updateTask(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const data = updateTaskSchema.parse(req.body);

      const task = await taskService.updateTask(
        id,
        data as UpdateTaskPayload
      );

      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found',
        });
        return;
      }

      try { getIO().to(`board_${task.boardId}`).emit('taskUpdated', task); } catch (e) { console.error(e); }

      res.status(200).json({
        success: true,
        data: task,
        message: 'Task updated successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update task';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * DELETE /tasks/:id
   * Delete task
   */
  async deleteTask(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      
      const task = await Task.findById(id);
      if (!task) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }
      const boardId = task.boardId;

      await taskService.deleteTask(id);

      try { getIO().to(`board_${boardId}`).emit('taskDeleted', id); } catch (e) { console.error(e); }

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete task';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /tasks/:id/checklist
   * Add checklist item
   */
  async addChecklistItem(
    req: Request,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { text } = z.object({ text: z.string().min(1) }).parse(req.body);

      const item = await taskService.addChecklistItem(id, text);

      const task = await Task.findById(id);
      if (task) {
        try { getIO().to(`board_${task.boardId}`).emit('taskUpdated', task); } catch (e) {}
      }

      res.status(201).json({
        success: true,
        data: item,
        message: 'Checklist item added',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to add checklist item';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * PATCH /tasks/:id/checklist/:itemId/toggle
   * Toggle checklist item
   */
  async toggleChecklistItem(
    req: Request,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { id, itemId } = req.params;

      const item = await taskService.toggleChecklistItem(id, itemId);

      const task = await Task.findById(id);
      if (task) {
        try { getIO().to(`board_${task.boardId}`).emit('taskUpdated', task); } catch (e) {}
      }

      res.status(200).json({
        success: true,
        data: item,
        message: 'Checklist item toggled',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to toggle checklist item';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * DELETE /tasks/:id/checklist/:itemId
   * Delete checklist item
   */
  async deleteChecklistItem(
    req: Request,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { id, itemId } = req.params;
      const task = await Task.findById(id);
      if (!task) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }

      await taskService.deleteChecklistItem(id, itemId);

      const updatedTask = await Task.findById(id);
      if (updatedTask) {
        try { getIO().to(`board_${updatedTask.boardId}`).emit('taskUpdated', updatedTask); } catch (e) {}
      }

      res.status(200).json({
        success: true,
        message: 'Checklist item deleted',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete checklist item';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /tasks/:id/comments
   * Add comment
   */
  async addComment(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { id } = req.params;
      const { content } = z
        .object({ content: z.string().min(1) })
        .parse(req.body);

      const comment = await taskService.addComment(
        id,
        req.user.userId,
        content
      );

      const task = await Task.findById(id);
      if (task) {
        try { getIO().to(`board_${task.boardId}`).emit('taskUpdated', task); } catch (e) {}
      }

      res.status(201).json({
        success: true,
        data: comment,
        message: 'Comment added',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to add comment';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * DELETE /tasks/:id/comments/:commentId
   * Delete comment
   */
  async deleteComment(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id, commentId } = req.params;
      
      const task = await Task.findById(id);

      await taskService.deleteComment(commentId);

      if (task) {
        const updatedTask = await Task.findById(id);
        if (updatedTask) {
          try { getIO().to(`board_${updatedTask.boardId}`).emit('taskUpdated', updatedTask); } catch (e) {}
        }
      }

      res.status(200).json({
        success: true,
        message: 'Comment deleted',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete comment';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }
}

export default new TaskController();
