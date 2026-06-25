/**
 * Project Service
 * - Create project
 * - Get projects by user
 * - Update project
 * - Delete project
 * - Invite member
 * - Remove member
 */

import { Project } from '../models/Project.js';
import { IProject } from '../types/index.js';
import { User } from '../models/User.js';
import { Board } from '../models/Board.js';

export class ProjectService {
  /**
   * Create new project
   */
  async createProject(
    title: string,
    description: string | undefined,
    ownerId: string
  ): Promise<IProject> {
    // Lấy email của owner từ DB
    const owner = await User.findById(ownerId);
    if (!owner) {
      throw new Error('User not found');
    }

    const newProject = new Project({
      title,
      description,
      ownerId,
      members: [
        {
          userId: ownerId,
          email: owner.email,
          role: 'admin',
          joinedAt: new Date(),
        },
      ],
      boards: [],
    });

    await newProject.save();
    return newProject.toObject();
  }

  /**
   * Get projects by user (paginated)
   */
  async getProjectsByUser(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ projects: any[]; total: number }> {
    const skip = (page - 1) * pageSize;

    // Find projects where user is owner or member
    const projects = await Project.find({
      $or: [
        { ownerId: userId },
        { 'members.userId': userId },
      ],
    })
      .skip(skip)
      .limit(pageSize);

    const total = await Project.countDocuments({
      $or: [
        { ownerId: userId },
        { 'members.userId': userId },
      ],
    });

    const populatedProjects = await Promise.all(
      projects.map(async (p) => {
        const boards = await Board.find({ projectId: p._id.toString() });
        return {
          ...p.toObject(),
          boards: boards.map((b) => b.toObject()),
        };
      })
    );

    return { projects: populatedProjects, total };
  }

  /**
   * Get project by ID
   */
  async getProjectById(projectId: string): Promise<any | null> {
    const project = await Project.findById(projectId);
    if (!project) return null;
    const boards = await Board.find({ projectId });
    return {
      ...project.toObject(),
      boards: boards.map((b) => b.toObject()),
    };
  }

  /**
   * Update project
   */
  async updateProject(
    projectId: string,
    title?: string,
    description?: string
  ): Promise<IProject | null> {
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    const project = await Project.findByIdAndUpdate(projectId, updates, {
      new: true,
    });

    return project ? project.toObject() : null;
  }

  /**
   * Delete project
   */
  async deleteProject(projectId: string): Promise<void> {
    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
      throw new Error('Project not found');
    }

    // TODO: Delete associated boards, columns, tasks
  }

  /**
   * Invite member by email
   */
  async inviteMember(
    projectId: string,
    email: string,
    role: 'admin' | 'member' = 'member'
  ): Promise<IProject> {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Check if user with email exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if already member
    const existingMember = project.members.find(
      (m) => m.userId === user._id.toString()
    );
    if (existingMember) {
      throw new Error('User is already a member');
    }

    // Add member
    project.members.push({
      userId: user._id.toString(),
      email: user.email,
      role,
      joinedAt: new Date(),
    });

    await project.save();
    return project.toObject();
  }

  /**
   * Remove member
   */
  async removeMember(projectId: string, userId: string): Promise<IProject> {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    project.members = project.members.filter((m) => m.userId !== userId);
    await project.save();

    return project.toObject();
  }
}

export default new ProjectService();
