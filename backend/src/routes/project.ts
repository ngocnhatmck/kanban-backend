/**
 * Project Routes
 */

import { Router } from 'express';
import projectController from '../controllers/ProjectController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All project routes require authentication
router.use(authMiddleware);

// Get projects by user
router.get('/', (req, res) => projectController.getProjects(req, res));

// Create project
router.post('/', (req, res) => projectController.createProject(req, res));

// Get project by ID
router.get('/:id', (req, res) => projectController.getProjectById(req, res));

// Update project
router.put('/:id', (req, res) => projectController.updateProject(req, res));

// Delete project
router.delete('/:id', (req, res) => projectController.deleteProject(req, res));

// Invite member
router.post('/:id/invite', (req, res) =>
  projectController.inviteMember(req, res)
);

// Remove member
router.delete('/:id/members/:userId', (req, res) =>
  projectController.removeMember(req, res)
);

export default router;
