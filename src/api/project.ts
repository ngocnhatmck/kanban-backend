/**
 * API Endpoints cho Project Management
 * - Tạo project, lấy danh sách project
 * - Invite member
 * - Cập nhật/Xoá project
 */

import axiosClient from './axiosClient';
import type {
  Project,
  CreateProjectRequest,
  InviteMemberRequest,
  PaginatedResponse,
} from '../types';

export const projectApi = {
  /**
   * Lấy danh sách tất cả project của user
   */
  getProjects: (page: number = 1, pageSize: number = 10) => {
    return axiosClient.get<PaginatedResponse<Project>>('/projects', {
      params: { page, pageSize },
    });
  },

  /**
   * Lấy chi tiết một project
   */
  getProjectById: (projectId: string) => {
    return axiosClient.get<Project>(`/projects/${projectId}`);
  },

  /**
   * Tạo project mới
   */
  createProject: (data: CreateProjectRequest) => {
    return axiosClient.post<Project>('/projects', data);
  },

  /**
   * Cập nhật project
   */
  updateProject: (projectId: string, data: Partial<CreateProjectRequest>) => {
    return axiosClient.put<Project>(`/projects/${projectId}`, data);
  },

  /**
   * Xoá project
   */
  deleteProject: (projectId: string) => {
    return axiosClient.delete(`/projects/${projectId}`);
  },

  /**
   * Mời member vào project bằng email
   */
  inviteMember: (projectId: string, data: InviteMemberRequest) => {
    return axiosClient.post(`/projects/${projectId}/invite`, data);
  },

  /**
   * Remove member khỏi project
   */
  removeMember: (projectId: string, userId: string) => {
    return axiosClient.delete(`/projects/${projectId}/members/${userId}`);
  },
};

export default projectApi;
