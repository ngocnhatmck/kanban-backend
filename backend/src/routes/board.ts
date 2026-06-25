/**
 * Board Routes
 */

import { Router } from 'express';
import boardController from '../controllers/BoardController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All board routes require authentication
router.use(authMiddleware);

// Get board by ID
router.get('/:id', (req, res) => boardController.getBoardById(req, res));

// Create board
router.post('/', (req, res) => boardController.createBoard(req, res));

// Reorder task — must be BEFORE /:id to avoid "reorder" matching :id
router.post('/reorder', (req, res) => boardController.reorderTask(req, res));

// Update board
router.put('/:id', (req, res) => boardController.updateBoard(req, res));

// Delete board
router.delete('/:id', (req, res) => boardController.deleteBoard(req, res));

// Add column
router.post('/:id/columns', (req, res) => boardController.addColumn(req, res));

export default router;
