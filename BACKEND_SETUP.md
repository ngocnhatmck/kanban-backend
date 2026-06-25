# 🚀 Backend Setup Complete!

## 📦 Cài đặt & Chạy Backend

### 1. Cài Dependencies

```bash
cd backend
npm install
```

### 2. Tạo `.env.local`

```bash
cp .env.example .env.local
```

**Cấu hình mặc định (để test locally):**

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kanban-board
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=http://localhost:5173
```

### 3. Cài đặt MongoDB

#### Option A: Dùng Docker (Recommended)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option B: Cài MongoDB locally

- **Windows**: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- **macOS**: `brew install mongodb-community`
- **Linux**: Xem hướng dẫn official MongoDB

Sau khi cài, chạy:
```bash
mongod
```

### 4. Chạy Development Server

```bash
npm run dev
```

**Output:**
```
✅ MongoDB connected successfully
✅ Server running at http://localhost:3000
📍 API: http://localhost:3000/api/v1
```

---

## 🔗 Kết nối Frontend & Backend

### 1. Cập nhật Frontend `.env.local`

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_ENV=development
```

### 2. Chạy Frontend

```bash
cd ../frontend
npm run dev
```

**Frontend:** http://localhost:5173/
**Backend API:** http://localhost:3000/api/v1

---

## 📚 API Documentation

### Authentication

#### Register
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user-id",
      "email": "user@example.com",
      "name": "User Name"
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "message": "Registration successful"
}
```

#### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```bash
GET /api/v1/auth/me
Authorization: Bearer <token>
```

#### Refresh Token
```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

---

### Projects

#### Create Project
```bash
POST /api/v1/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Project",
  "description": "Project description"
}
```

#### Get All Projects
```bash
GET /api/v1/projects?page=1&pageSize=10
Authorization: Bearer <token>
```

#### Get Project by ID
```bash
GET /api/v1/projects/<projectId>
Authorization: Bearer <token>
```

#### Update Project
```bash
PUT /api/v1/projects/<projectId>
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Project
```bash
DELETE /api/v1/projects/<projectId>
Authorization: Bearer <token>
```

#### Invite Member
```bash
POST /api/v1/projects/<projectId>/invite
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "member@example.com",
  "role": "member"
}
```

#### Remove Member
```bash
DELETE /api/v1/projects/<projectId>/members/<userId>
Authorization: Bearer <token>
```

---

### Boards

#### Get Board (with Columns & Tasks)
```bash
GET /api/v1/boards/<boardId>
Authorization: Bearer <token>
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "_id": "board-id",
    "projectId": "project-id",
    "title": "Board Title",
    "columns": [
      {
        "_id": "column-id",
        "title": "Todo",
        "index": 0,
        "taskIds": [
          {
            "_id": "task-id",
            "title": "Task Title",
            "priority": "high",
            "columnId": "column-id",
            "index": 0,
            "checklist": [],
            "commentIds": []
          }
        ]
      }
    ]
  }
}
```

#### Create Board
```bash
POST /api/v1/boards?projectId=<projectId>
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Board Title",
  "description": "Board description"
}
```

#### Reorder Task (CRITICAL for Drag & Drop)
```bash
POST /api/v1/boards/reorder?boardId=<boardId>
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "task-id",
  "fromColumnId": "column-1",
  "fromIndex": 0,
  "toColumnId": "column-2",
  "toIndex": 1
}
```

**Returns:** Full updated board structure

---

### Tasks

#### Create Task
```bash
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "boardId": "board-id",
  "columnId": "column-id",
  "title": "Task Title",
  "description": "Task description",
  "priority": "high"
}
```

#### Update Task
```bash
PUT /api/v1/tasks/<taskId>
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "priority": "medium",
  "assignees": ["user-id1"],
  "labels": ["label1"]
}
```

#### Delete Task
```bash
DELETE /api/v1/tasks/<taskId>
Authorization: Bearer <token>
```

#### Add Checklist Item
```bash
POST /api/v1/tasks/<taskId>/checklist
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Checklist item text"
}
```

#### Toggle Checklist Item
```bash
PATCH /api/v1/tasks/<taskId>/checklist/<itemId>/toggle
Authorization: Bearer <token>
```

#### Add Comment
```bash
POST /api/v1/tasks/<taskId>/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Comment text"
}
```

#### Delete Comment
```bash
DELETE /api/v1/tasks/<taskId>/comments/<commentId>
Authorization: Bearer <token>
```

---

## 🧪 Test API với Postman/Insomnia

1. **Import Collection:**
   - Mở Postman/Insomnia
   - New → Request Collection
   - Tạo requests theo endpoints trên

2. **Workflow Test:**
   ```
   1. Register user → Lấy token
   2. Create project
   3. Create board trong project
   4. Create column trong board
   5. Create task trong column
   6. Reorder task (drag & drop)
   7. Add comment, checklist
   ```

---

## 🔧 Troubleshooting

### MongoDB Connection Failed
```
❌ MongooseError: connect ECONNREFUSED
```
**Fix:**
```bash
# Kiểm tra MongoDB running
mongod
# Hoặc dùng Docker
docker run -d -p 27017:27017 mongo:latest
```

### Port 3000 Already In Use
```
❌ listen EADDRINUSE: address already in use :::3000
```
**Fix:**
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

### JWT Token Invalid/Expired
```json
{"success": false, "message": "Invalid token"}
```
**Fix:**
- Refresh token: POST /api/v1/auth/refresh
- Login lại để lấy token mới

---

## 📊 Database Structure

### Collections

1. **Users** - Lưu user account
2. **Projects** - Lưu projects, members, boards
3. **Boards** - Lưu boards, columns
4. **Columns** - Lưu columns, task IDs
5. **Tasks** - Lưu tasks, comments, checklist
6. **Comments** - Lưu comments

### Relationships

```
User
├── Creates Projects
│   ├── Contains Boards
│   │   ├── Contains Columns
│   │   │   └── Contains Tasks
│   │   │       ├── Contains Checklist Items
│   │   │       └── Has Comments
│   │   └── Has Members (Users)
```

---

## 🚀 Production Deployment

### Build Backend
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kanban
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
CORS_ORIGIN=https://yourdomain.com
```

---

**Backend setup complete!** ✅ Frontend & Backend ready để kết nối.
