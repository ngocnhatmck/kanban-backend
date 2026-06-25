/**
 * Task Routes
 */

import { Router } from 'express';
import taskController from '../controllers/TaskController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

// Create task
router.post('/', (req, res) => taskController.createTask(req, res));

// Update task
router.put('/:id', (req, res) => taskController.updateTask(req, res));

// Delete task
router.delete('/:id', (req, res) => taskController.deleteTask(req, res));

// Checklist items
router.post('/:id/checklist', (req, res) =>
  taskController.addChecklistItem(req, res)
);
router.patch('/:id/checklist/:itemId/toggle', (req, res) =>
  taskController.toggleChecklistItem(req, res)
);
router.delete('/:id/checklist/:itemId', (req, res) =>
  taskController.deleteChecklistItem(req, res)
);

// Comments
router.post('/:id/comments', (req, res) =>
  taskController.addComment(req, res)
);
router.delete('/:id/comments/:commentId', (req, res) =>
  taskController.deleteComment(req, res)
);

export default router;
