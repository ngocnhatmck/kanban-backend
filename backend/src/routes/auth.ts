/**
 * Auth Routes
 */

import { Router } from 'express';
import authController from '../controllers/AuthController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refresh(req, res));

// Protected routes
router.get('/me', authMiddleware, (req, res) => authController.getMe(req, res));

export default router;
