/**
 * Project Controller
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import projectService from '../services/ProjectService.js';
import { ApiResponse } from '../types/index.js';

const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
});

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member']).optional(),
});

export class ProjectController {
  /**
   * POST /projects
   * Create new project
   */
  async createProject(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { title, description } = createProjectSchema.parse(req.body);

      const project = await projectService.createProject(
        title,
        description,
        req.user.userId
      );

      res.status(201).json({
        success: true,
        data: project,
        message: 'Project created successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create project';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * GET /projects
   * Get projects by user (paginated)
   */
  async getProjects(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const { projects, total } = await projectService.getProjectsByUser(
        req.user.userId,
        page,
        pageSize
      );

      res.status(200).json({
        success: true,
        data: {
          items: projects,
          total,
          page,
          pageSize,
        },
        message: 'Projects fetched successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch projects',
      });
    }
  }

  /**
   * GET /projects/:id
   * Get project by ID
   */
  async getProjectById(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { id } = req.params;

      const project = await projectService.getProjectById(id);

      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Project not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: project,
        message: 'Project fetched successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch project',
      });
    }
  }

  /**
   * PUT /projects/:id
   * Update project
   */
  async updateProject(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { id } = req.params;
      const { title, description } = updateProjectSchema.parse(req.body);

      const project = await projectService.updateProject(id, title, description);

      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Project not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: project,
        message: 'Project updated successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update project';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * DELETE /projects/:id
   * Delete project
   */
  async deleteProject(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { id } = req.params;

      await projectService.deleteProject(id);

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete project';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /projects/:id/invite
   * Invite member by email
   */
  async inviteMember(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { id } = req.params;
      const { email, role } = inviteMemberSchema.parse(req.body);

      const project = await projectService.inviteMember(id, email, role);

      res.status(200).json({
        success: true,
        data: project,
        message: 'Member invited successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to invite member';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * DELETE /projects/:id/members/:userId
   * Remove member
   */
  async removeMember(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { id, userId } = req.params;

      const project = await projectService.removeMember(id, userId);

      res.status(200).json({
        success: true,
        data: project,
        message: 'Member removed successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to remove member';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }
}

export default new ProjectController();
