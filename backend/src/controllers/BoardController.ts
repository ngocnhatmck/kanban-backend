/**
 * Board Controller
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import boardService, { ReorderTaskPayload } from '../services/BoardService.js';
import { ApiResponse } from '../types/index.js';
import { getIO } from '../utils/socket.js';

const createBoardSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

const updateBoardSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
});

const reorderTaskSchema = z.object({
  taskId: z.string(),
  fromColumnId: z.string(),
  fromIndex: z.number(),
  toColumnId: z.string(),
  toIndex: z.number(),
});

export class BoardController {
  /**
   * GET /boards/:id
   * Get board with all columns and tasks populated
   */
  async getBoardById(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;

      const board = await boardService.getBoardWithColumnsAndTasks(id);

      if (!board) {
        res.status(404).json({
          success: false,
          message: 'Board not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: board,
        message: 'Board fetched successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch board',
      });
    }
  }

  /**
   * POST /boards
   * Create new board
   */
  async createBoard(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { title, description } = createBoardSchema.parse(req.body);
      const { projectId } = req.query;

      if (!projectId || typeof projectId !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Project ID is required',
        });
        return;
      }

      const board = await boardService.createBoard(projectId, title, description);

      res.status(201).json({
        success: true,
        data: board,
        message: 'Board created successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create board';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * PUT /boards/:id
   * Update board
   */
  async updateBoard(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description } = updateBoardSchema.parse(req.body);

      const board = await boardService.updateBoard(id, title, description);

      if (!board) {
        res.status(404).json({
          success: false,
          message: 'Board not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: board,
        message: 'Board updated successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update board';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * DELETE /boards/:id
   * Delete board
   */
  async deleteBoard(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;

      await boardService.deleteBoard(id);

      res.status(200).json({
        success: true,
        message: 'Board deleted successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete board';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /tasks/reorder
   * Reorder task - CRITICAL for drag & drop
   * Returns full board structure with updated positions
   */
  async reorderTask(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const payload = reorderTaskSchema.parse(req.body);
      const { boardId } = req.query;

      if (!boardId || typeof boardId !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Board ID is required',
        });
        return;
      }

      const updatedBoard = await boardService.reorderTask(
        boardId,
        payload as ReorderTaskPayload
      );

      try { getIO().to(`board_${boardId}`).emit('boardUpdated', updatedBoard); } catch (e) { console.error(e); }

      res.status(200).json({
        success: true,
        data: updatedBoard,
        message: 'Task reordered successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to reorder task';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /boards/:id/columns
   * Add column to board
   */
  async addColumn(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id: boardId } = req.params;
      const { title } = z.object({ title: z.string().min(1) }).parse(req.body);

      const { board, column } = await boardService.addColumn(boardId, title);

      try { getIO().to(`board_${boardId}`).emit('columnCreated', column); } catch (e) { console.error(e); }

      res.status(201).json({
        success: true,
        data: { board, column },
        message: 'Column added successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to add column';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }
}

export default new BoardController();
