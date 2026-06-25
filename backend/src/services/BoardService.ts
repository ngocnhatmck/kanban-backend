/**
 * Board Service
 * - Get board by ID (with columns and tasks)
 * - Reorder task (CRITICAL: optimized for drag & drop)
 * - Create/Update/Delete board
 */

import { Board } from '../models/Board.js';
import { Column } from '../models/Column.js';
import { Task } from '../models/Task.js';
import { IBoard, IColumn, ITask } from '../types/index.js';

export interface ReorderTaskPayload {
  taskId: string;
  fromColumnId: string;
  fromIndex: number;
  toColumnId: string;
  toIndex: number;
}

interface BoardWithColumnsAndTasks extends Omit<IBoard, 'columns'> {
  columns: (Omit<IColumn, 'taskIds'> & {
    taskIds: ITask[];
  })[];
}

export class BoardService {
  /**
   * Get board by ID with all columns and tasks populated
   * Return format matches Frontend's useBoard hook expectation
   */
  async getBoardWithColumnsAndTasks(
    boardId: string
  ): Promise<BoardWithColumnsAndTasks | null> {
    const board = await Board.findById(boardId);

    if (!board) {
      return null;
    }

    // Fetch all columns for this board
    const columns = await Column.find({
      _id: { $in: board.columns },
    }).sort({ index: 1 });

    // Fetch all tasks for columns
    const allTaskIds = columns.flatMap((col) => col.taskIds);
    const tasks = await Task.find({
      _id: { $in: allTaskIds },
    });

    // Build task map for easy lookup
    const taskMap = new Map(tasks.map((t) => [t._id.toString(), t.toObject()]));

    // Build columns with populated tasks
    const columnsWithTasks = columns.map((col) => ({
      ...col.toObject(),
      taskIds: col.taskIds
        .map((taskId) => taskMap.get(taskId.toString()))
        .filter((task) => task !== undefined) as ITask[],
    }));

    return {
      ...board.toObject(),
      columns: columnsWithTasks,
    };
  }

  /**
   * Reorder task - CRITICAL: Optimized for drag & drop
   *
   * Updates:
   * 1. Remove task from fromColumn.taskIds
   * 2. Add task to toColumn.taskIds at toIndex
   * 3. Update task.columnId if different column
   * 4. Update task.index
   *
   * Returns: Full board structure with updated columns and tasks
   */
  async reorderTask(
    boardId: string,
    payload: ReorderTaskPayload
  ): Promise<BoardWithColumnsAndTasks> {
    const { taskId, fromColumnId, fromIndex, toColumnId, toIndex } = payload;

    // Fetch and update fromColumn
    const fromColumn = await Column.findById(fromColumnId);
    if (!fromColumn) {
      throw new Error('From column not found');
    }

    // Fetch and update toColumn
    const toColumn = await Column.findById(toColumnId);
    if (!toColumn) {
      throw new Error('To column not found');
    }

    // Fetch task
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // ============================================================================
    // UPDATE COLUMNS
    // ============================================================================

    // Remove from fromColumn
    fromColumn.taskIds.splice(fromIndex, 1);
    await fromColumn.save();

    // Add to toColumn
    toColumn.taskIds.splice(toIndex, 0, taskId);
    await toColumn.save();

    // ============================================================================
    // UPDATE TASK
    // ============================================================================

    // Update columnId if moved to different column
    if (task.columnId !== toColumnId) {
      task.columnId = toColumnId;
    }

    // Update index
    task.index = toIndex;
    await task.save();

    // ============================================================================
    // RETURN UPDATED BOARD
    // ============================================================================

    const updatedBoard = await this.getBoardWithColumnsAndTasks(boardId);
    if (!updatedBoard) {
      throw new Error('Board not found after update');
    }

    return updatedBoard;
  }

  /**
   * Create new board
   */
  async createBoard(
    projectId: string,
    title: string,
    description?: string
  ): Promise<IBoard> {
    const newBoard = new Board({
      projectId,
      title,
      description,
      columns: [],
    });

    await newBoard.save();

    // Create default columns: To Do, Doing, Done
    const defaultColumnTitles = ['To Do', 'Doing', 'Done'];
    const columnIds: string[] = [];

    for (let i = 0; i < defaultColumnTitles.length; i++) {
      const col = new Column({
        boardId: newBoard._id.toString(),
        title: defaultColumnTitles[i],
        index: i,
        taskIds: [],
      });
      await col.save();
      columnIds.push(col._id.toString());
    }

    newBoard.columns = columnIds;
    await newBoard.save();

    return newBoard.toObject();
  }

  /**
   * Update board
   */
  async updateBoard(
    boardId: string,
    title?: string,
    description?: string
  ): Promise<IBoard | null> {
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    const board = await Board.findByIdAndUpdate(boardId, updates, {
      new: true,
    });

    return board ? board.toObject() : null;
  }

  /**
   * Delete board
   */
  async deleteBoard(boardId: string): Promise<void> {
    const board = await Board.findByIdAndDelete(boardId);

    if (!board) {
      throw new Error('Board not found');
    }

    // Delete all columns in this board
    await Column.deleteMany({
      _id: { $in: board.columns },
    });

    // Delete all tasks in this board
    await Task.deleteMany({ boardId });
  }

  /**
   * Add column to board
   */
  async addColumn(
    boardId: string,
    title: string
  ): Promise<{ board: BoardWithColumnsAndTasks; column: IColumn }> {
    const board = await Board.findById(boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    // Create new column
    const newColumn = new Column({
      boardId,
      title,
      index: board.columns.length,
      taskIds: [],
    });

    await newColumn.save();

    // Add to board
    board.columns.push(newColumn._id.toString());
    await board.save();

    // Return updated board
    const updatedBoard = await this.getBoardWithColumnsAndTasks(boardId);
    if (!updatedBoard) {
      throw new Error('Board not found after update');
    }

    return {
      board: updatedBoard,
      column: newColumn.toObject(),
    };
  }
}

export default new BoardService();
