# 🚀 Kanban Board Backend

## 📋 Cấu Trúc Project

```
backend/src/
├── config/
│   ├── database.ts       # MongoDB connection
│   └── jwt.ts            # JWT configuration
├── controllers/          # HTTP request handlers
│   ├── AuthController.ts # Register, Login, Refresh
│   ├── BoardController.ts # Board CRUD + Reorder Task
│   └── TaskController.ts # Task CRUD + Checklist + Comments
├── middleware/
│   └── auth.ts           # JWT authentication middleware
├── models/               # Mongoose schemas
│   ├── User.ts
│   ├── Project.ts
│   ├── Board.ts
│   ├── Column.ts
│   ├── Task.ts
│   └── Comment.ts
├── services/             # Business logic
│   ├── AuthService.ts    # User registration & login
│   ├── BoardService.ts   # Board operations (with reorder optimization)
│   └── TaskService.ts    # Task operations
├── routes/               # API routes
│   ├── auth.ts           # /api/v1/auth
│   ├── board.ts          # /api/v1/boards
│   └── task.ts           # /api/v1/tasks
├── types/
│   └── index.ts          # TypeScript interfaces
├── utils/
│   └── jwt.ts            # JWT & password utilities
└── index.ts              # Express app entry point
```

## 🛠️ Cài đặt & Chạy

### 1. Cài dependencies

```bash
npm install
```

### 2. Tạo `.env.local` từ `.env.example`

```bash
cp .env.example .env.local
```

Sửa các giá trị theo máy của bạn:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/kanban-board
JWT_SECRET=your_secret_key
```

### 3. Chạy MongoDB

```bash
# Nếu dùng Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Hoặc cài MongoDB locally và chạy
mongod
```

### 4. Chạy development server

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

API Base URL: `http://localhost:3000/api/v1`

## 📚 API Endpoints

### Authentication

```
POST   /api/v1/auth/register        - Register new user
POST   /api/v1/auth/login           - Login user
POST   /api/v1/auth/refresh         - Refresh token
GET    /api/v1/auth/me              - Get current user (auth required)
```

### Board

```
GET    /api/v1/boards/:id           - Get board with columns & tasks
POST   /api/v1/boards               - Create board (projectId in query)
PUT    /api/v1/boards/:id           - Update board
DELETE /api/v1/boards/:id           - Delete board
POST   /api/v1/boards/:id/columns   - Add column to board
POST   /api/v1/boards/reorder       - Reorder task ⭐ (boardId in query)
```

### Task

```
POST   /api/v1/tasks                      - Create task
PUT    /api/v1/tasks/:id                  - Update task
DELETE /api/v1/tasks/:id                  - Delete task
POST   /api/v1/tasks/:id/checklist        - Add checklist item
PATCH  /api/v1/tasks/:id/checklist/:itemId/toggle - Toggle checklist
DELETE /api/v1/tasks/:id/checklist/:itemId       - Delete checklist item
POST   /api/v1/tasks/:id/comments         - Add comment
DELETE /api/v1/tasks/:id/comments/:commentId    - Delete comment
```

## 🔐 Xác thực (Authentication)

### Login & Get Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {"_id":"...", "email":"...", "name":"..."},
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Sử dụng Token

Đính kèm token vào `Authorization` header:

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

## ⚡ Tính Năng Quan Trọng

### 1. JWT Token Refresh

Khi token hết hạn (401 error), client gửi `refreshToken` để lấy `token` mới:

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"eyJhbGc..."}'
```

### 2. Reorder Task - Optimized for Drag & Drop ⭐

```bash
curl -X POST http://localhost:3000/api/v1/boards/reorder?boardId=board-id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token..." \
  -d '{
    "taskId": "task-1",
    "fromColumnId": "col-1",
    "fromIndex": 0,
    "toColumnId": "col-2",
    "toIndex": 1
  }'
```

**Optimization:**
- Cập nhật `taskIds` array trong Column (O(n) operation, hiệu quả)
- Cập nhật `index` trong Task
- Return toàn bộ Board structure để Frontend update UI

## 🏗️ Architecture Pattern

```
Request → Route → Controller → Service → Model → Database
                                 ↓
                           Response JSON
```

### 1. **Routes** (`src/routes/`)
- Định nghĩa HTTP endpoints
- Gắn middleware (auth)
- Forward request tới controller

### 2. **Controllers** (`src/controllers/`)
- Xử lý HTTP request/response
- Validate input (dùng Zod)
- Gọi service

### 3. **Services** (`src/services/`)
- Chứa business logic
- Tương tác với database
- Xử lý errors

### 4. **Models** (`src/models/`)
- Định nghĩa Mongoose schemas
- Tạo collections trong MongoDB

## 🔄 Request/Response Format

### Success Response

```json
{
  "success": true,
  "data": { "...": "..." },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": { "field": ["error message"] }
}
```

## 🗄️ MongoDB Collections

### User
```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "password": "hashed_password",
  "name": "User Name",
  "avatar": "avatar_url",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Project
```json
{
  "_id": ObjectId,
  "title": "Project Title",
  "description": "...",
  "ownerId": "user-id",
  "members": [{ "userId": "...", "role": "admin|member" }],
  "boards": ["board-id1", "board-id2"],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Board
```json
{
  "_id": ObjectId,
  "projectId": "project-id",
  "title": "Board Title",
  "columns": ["column-id1", "column-id2"],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Column
```json
{
  "_id": ObjectId,
  "boardId": "board-id",
  "title": "Todo",
  "index": 0,
  "taskIds": ["task-id1", "task-id2"],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Task
```json
{
  "_id": ObjectId,
  "boardId": "board-id",
  "columnId": "column-id",
  "title": "Task Title",
  "priority": "low|medium|high",
  "assignees": ["user-id1"],
  "labels": ["label1"],
  "checklist": [{ "_id": ObjectId, "text": "...", "done": false }],
  "commentIds": ["comment-id1"],
  "index": 0,
  "createdBy": "user-id",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

## 📦 Build & Deploy

### Build TypeScript

```bash
npm run build
```

Outputsẽ vào folder `dist/`

### Chạy production

```bash
npm start
```

## 🐛 Debugging

Enable logs:

```env
NODE_ENV=development
DEBUG=kanban:*
```

## 📝 Thêm Tính Năng

### Thêm API endpoint mới

1. Tạo method trong **Service**
2. Tạo method trong **Controller**
3. Thêm route trong **Routes**

Example: Thêm endpoint DELETE Project

```typescript
// 1. ProjectService.ts
async deleteProject(projectId: string): Promise<void> {
  await Project.findByIdAndDelete(projectId);
}

// 2. ProjectController.ts
async deleteProject(req: Request, res: Response) {
  const { id } = req.params;
  await projectService.deleteProject(id);
  res.json({ success: true });
}

// 3. project.ts routes
router.delete('/:id', (req, res) => projectController.deleteProject(req, res));
```

---

**Backend setup complete!** ✅ Giờ Frontend có thể kết nối với Backend API.
