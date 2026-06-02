import type { Workspace } from '../types/types';

export const initialWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    title: 'Công ty ABC',
    description: 'Không gian làm việc chính',
    boards: [
      {
        id: 'board-1',
        title: 'Sprint 1 - Product Launch',
        description: 'Quản lý các công việc cho đợt ra mắt sản phẩm đầu tiên',
        columns: [
          { id: 'column-todo', title: 'To Do', taskIds: ['task-1', 'task-2', 'task-3'] },
          { id: 'column-doing', title: 'Doing', taskIds: ['task-4', 'task-5'] },
          { id: 'column-done', title: 'Done', taskIds: ['task-6'] },
        ],
        tasks: {
          'task-1': {
            id: 'task-1',
            title: 'Thiết kế giao diện Landing Page',
            description: 'Tạo mockup và prototype cho trang landing page chính. Bao gồm phiên bản desktop và mobile responsive.',
            priority: 'high',
            labels: ['Design', 'UI/UX'],
            checklist: [
              { id: 'cl-1-1', text: 'Tạo wireframe desktop', done: true },
              { id: 'cl-1-2', text: 'Tạo wireframe mobile', done: true },
              { id: 'cl-1-3', text: 'Thiết kế màu sắc & typography', done: false },
              { id: 'cl-1-4', text: 'Review với team', done: false },
            ],
            createdAt: '2026-05-25T09:00:00.000Z',
            updatedAt: '2026-05-25T09:00:00.000Z',
          },
          'task-2': {
            id: 'task-2',
            title: 'Xây dựng API đăng ký người dùng',
            description: 'Phát triển REST API cho chức năng đăng ký tài khoản mới, bao gồm xác thực email và validation dữ liệu.',
            priority: 'high',
            labels: ['Backend', 'API'],
            checklist: [
              { id: 'cl-2-1', text: 'Thiết kế schema database', done: true },
              { id: 'cl-2-2', text: 'Viết endpoint POST /register', done: false },
              { id: 'cl-2-3', text: 'Tích hợp gửi email xác thực', done: false },
            ],
            createdAt: '2026-05-26T10:30:00.000Z',
            updatedAt: '2026-05-26T10:30:00.000Z',
          },
          'task-3': {
            id: 'task-3',
            title: 'Viết unit test module thanh toán',
            description: 'Bổ sung unit test coverage cho payment module, đảm bảo tối thiểu 80% code coverage.',
            priority: 'medium',
            labels: ['Testing', 'QA'],
            checklist: [
              { id: 'cl-3-1', text: 'Test happy path', done: false },
              { id: 'cl-3-2', text: 'Test edge cases', done: false },
            ],
            createdAt: '2026-05-27T08:15:00.000Z',
            updatedAt: '2026-05-27T08:15:00.000Z',
          },
          'task-4': {
            id: 'task-4',
            title: 'Tích hợp thông báo realtime',
            description: 'Sử dụng WebSocket để xây dựng chức năng thông báo realtime cho người dùng.',
            priority: 'medium',
            labels: ['Frontend', 'Backend'],
            checklist: [
              { id: 'cl-4-1', text: 'Setup WebSocket server', done: true },
              { id: 'cl-4-2', text: 'Build notification UI', done: false },
            ],
            createdAt: '2026-05-24T14:00:00.000Z',
            updatedAt: '2026-05-28T16:45:00.000Z',
          },
          'task-5': {
            id: 'task-5',
            title: 'Cập nhật tài liệu hướng dẫn',
            description: 'Viết documentation cho các tính năng mới trong sprint này, bao gồm screenshots và ví dụ.',
            priority: 'low',
            labels: ['Documentation'],
            checklist: [],
            createdAt: '2026-05-28T11:00:00.000Z',
            updatedAt: '2026-05-29T09:20:00.000Z',
          },
          'task-6': {
            id: 'task-6',
            title: 'Cấu hình CI/CD pipeline',
            description: 'Thiết lập GitHub Actions cho tự động build, test và deploy lên staging environment.',
            priority: 'high',
            labels: ['DevOps', 'Infrastructure'],
            checklist: [
              { id: 'cl-6-1', text: 'Cấu hình GitHub Actions', done: true },
              { id: 'cl-6-2', text: 'Test pipeline staging', done: true },
              { id: 'cl-6-3', text: 'Deploy production', done: true },
            ],
            createdAt: '2026-05-22T08:00:00.000Z',
            updatedAt: '2026-05-30T17:30:00.000Z',
          },
        },
      },
    ],
    createdAt: '2026-05-20T07:00:00.000Z',
  },
];
