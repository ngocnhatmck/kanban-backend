# 📱 Frontend Setup & Development Guide

## 🎯 Bước 1: Cài đặt Dependencies

```bash
cd frontend
npm install
```

**Các package mới được thêm:**
- `axios`: HTTP client với interceptor JWT
- `react-router-dom`: Routing cho multi-page app

## 🌍 Bước 2: Tạo File `.env.local`

```bash
cp .env.example .env.local
```

Cấu hình theo backend của bạn:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENV=development
```

## 📁 Bước 3: Cấu Trúc Thư Mục (Hoàn Thành)

```
frontend/src/
├── api/                 # API Service Layer
│   ├── axiosClient.ts   # Axios config + JWT handling + error handling 401
│   ├── auth.ts          # Auth endpoints
│   ├── project.ts       # Project endpoints
│   └── board.ts         # Board & Task endpoints
├── components/          # React Components
│   ├── Board/
│   ├── Column/
│   ├── TaskCard/
│   ├── TaskModal/
│   ├── Header/
│   ├── Sidebar/
│   ├── AddTaskForm/
│   └── common/          # Reusable components (Badge, Button, Modal)
├── pages/               # Page Components
│   ├── KanbanPage.tsx   # Main Kanban Board Page
│   └── KanbanPage.module.css
├── hooks/               # Custom React Hooks
│   ├── useBoardStore.ts # (Old) Local state management with Zustand
│   ├── useBoard.ts      # ⭐ NEW: Fetch board + Optimistic UI for drag & drop
│   ├── useAuth.ts       # ⭐ NEW: Authentication state management
│   └── useDragAndDrop.ts # (Old) Drag & drop logic
├── types/               # TypeScript Definitions
│   └── index.ts         # ⭐ NEW: Interface definitions (User, Project, Board, Task, etc.)
├── utils/
│   └── helpers.ts
├── App.tsx
├── main.tsx
├── index.css
└── vite-env.d.ts        # ⭐ NEW: Vite environment types
```

## 🔑 Key Files Đã Thêm/Sửa

### 1. **src/types/index.ts** (NEW ⭐)
Định nghĩa toàn bộ TypeScript interfaces:
- `User`, `AuthResponse`, `LoginRequest`, `RegisterRequest`
- `Project`, `ProjectMember`
- `Board`, `Column`, `Task`, `ChecklistItem`
- `Comment`, `DragDropPayload`
- `ApiResponse`, `PaginatedResponse`
- API Request/Response types

### 2. **src/api/axiosClient.ts** (NEW ⭐)
Cấu hình Axios client với các tính năng:
- ✅ Tự động thêm JWT token vào header
- ✅ Xử lý lỗi 401: Refresh token hoặc redirect to /login
- ✅ Xử lý lỗi 403: Redirect to /forbidden
- ✅ Request/Response interceptors

### 3. **src/api/auth.ts**, **project.ts**, **board.ts** (NEW ⭐)
API service layer với các methods:
- `authApi.login()`, `authApi.register()`, `authApi.getMe()`
- `projectApi.getProjects()`, `projectApi.createProject()`, `projectApi.inviteMember()`
- `boardApi.getBoardById()`, `boardApi.reorderTask()`, `boardApi.createTask()`

### 4. **src/hooks/useBoard.ts** (NEW ⭐)
Custom hook để fetch board data với **Optimistic UI**:
```typescript
const { board, isLoading, error, reorderTask, isReordering } = useBoard(boardId);

// Gọi reorderTask - UI update immediately, API async
reorderTask({
  taskId: 'task-1',
  fromColumnId: 'col-1',
  toColumnId: 'col-2',
  fromIndex: 0,
  toIndex: 1,
});
```

### 5. **src/hooks/useAuth.ts** (NEW ⭐)
Custom hook để quản lý authentication:
```typescript
const { user, isAuthenticated, login, register, logout } = useAuth();

// Login
await login({ email: 'user@example.com', password: '...' });

// Register
await register({ email: 'user@example.com', password: '...', name: '...' });

// Logout
logout();
```

### 6. **src/pages/KanbanPage.tsx** (NEW ⭐)
Main page component:
- Fetch board từ API bằng `useBoard()`
- Render `Board`, `Header`, `Sidebar`
- Handle loading & error states

## ✅ Checklist Bước Tiếp Theo (Backend)

Sau khi setup Frontend xong, bạn cần:

- [ ] **Bước 2.1**: Tạo Backend folder + cấu trúc project
- [ ] **Bước 2.2**: Setup MongoDB + Mongoose
- [ ] **Bước 2.3**: Viết API endpoints
- [ ] **Bước 2.4**: Viết middleware authentication
- [ ] **Bước 2.5**: Test API endpoints với Postman/Insomnia

## 🚀 Chạy Frontend

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:5173/`

## 📝 Ghi Chú

1. **Optimistic UI Pattern**: Khi drag & drop task, UI update ngay lập tức trước khi API trả về. Nếu API thất bại, state rollback lại.

2. **JWT Token Management**: Token tự động được lưu vào `localStorage` và đính kèm vào mọi request.

3. **Error Handling**: Lỗi 401 sẽ tự động refresh token. Nếu refresh thất bại, redirect to login.

4. **Types Safety**: Toàn bộ code sử dụng TypeScript strict mode, không có `any`.

---

**Tiếp theo: Xây dựng Backend (Node.js + TypeScript + MongoDB)**
