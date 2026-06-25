# ✨ Kanban Board - Setup Complete!

## 🎉 Congratulations!

Bạn đã hoàn thành:
✅ **Frontend** - React + TypeScript + Zustand + Vite
✅ **Backend** - Node.js + Express + MongoDB + TypeScript
✅ **API Layer** - Axios client + JWT authentication
✅ **Database** - Mongoose models + collections

---

## 📁 Project Structure

```
Website_QLCV/
├── frontend/                 # React + TypeScript (port 5173)
│   ├── src/
│   │   ├── api/             # HTTP client + API services
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks (useBoard, useAuth, etc.)
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Utility functions
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.local
│
├── backend/                  # Node.js + Express (port 3000)
│   ├── src/
│   │   ├── config/          # Database & JWT config
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # JWT & password utils
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local
│
├── FRONTEND_SETUP.md         # Frontend setup guide
├── BACKEND_SETUP.md          # Backend setup guide
└── SETUP_COMPLETE.md         # This file
```

---

## 🚀 Quick Start

### Step 1: Backend Setup & Run

```bash
# 1. Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest
# OR
mongod

# 2. Setup backend
cd backend
npm install

# 3. Create .env.local
cp .env.example .env.local
# Edit with your configuration

# 4. Run development server
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
✅ Server running at http://localhost:3000
📍 API: http://localhost:3000/api/v1
```

### Step 2: Frontend Setup & Run

```bash
# 1. Setup frontend (in new terminal)
cd frontend
npm install

# 2. Create .env.local
cp .env.example .env.local
# Ensure VITE_API_BASE_URL=http://localhost:3000/api/v1

# 3. Run development server
npm run dev
```

**Expected Output:**
```
✅ Local: http://localhost:5173/
✨ Local: http://localhost:5173/ (with TS support)
```

---

## 🔄 Integration Flow

```
┌─────────────────────┐
│  Frontend (React)   │ http://localhost:5173
├─────────────────────┤
│ useBoard hook       │ ← Fetch board data
│ useAuth hook        │ ← Manage auth state
│ Axios API client    │ ← HTTP requests
└──────────┬──────────┘
           │ HTTP/REST
           ↓
┌─────────────────────┐
│  Backend (Express)  │ http://localhost:3000/api/v1
├─────────────────────┤
│ Auth endpoints      │ → Register, Login, Refresh
│ Project endpoints   │ → CRUD projects
│ Board endpoints     │ → CRUD boards, Reorder tasks
│ Task endpoints      │ → CRUD tasks, Comments, Checklist
└──────────┬──────────┘
           │ Queries
           ↓
┌─────────────────────┐
│  MongoDB Database   │ localhost:27017
├─────────────────────┤
│ Collections:        │
│ • users             │
│ • projects          │
│ • boards            │
│ • columns           │
│ • tasks             │
│ • comments          │
└─────────────────────┘
```

---

## 🧪 Test API

### 1. Register User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Save the returned `token` and `refreshToken` for next requests**

### 2. Create Project

```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Project",
    "description": "Test project"
  }'
```

**Save the returned `_id` as `<projectId>`**

### 3. Create Board

```bash
curl -X POST http://localhost:3000/api/v1/boards?projectId=<projectId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kanban Board",
    "description": "Main board"
  }'
```

**Save the returned `_id` as `<boardId>`**

### 4. Get Board (Full Structure)

```bash
curl -X GET http://localhost:3000/api/v1/boards/<boardId> \
  -H "Authorization: Bearer <token>"
```

---

## 📋 Key Features Implemented

### ✅ Authentication
- Register new user
- Login with email/password
- JWT token generation & refresh
- Automatic token refresh on 401
- Protected routes with middleware

### ✅ Project Management
- Create projects
- Invite members
- Manage member roles
- Delete projects

### ✅ Kanban Board
- Create boards
- Create columns
- **Drag & drop with optimistic UI** ⭐
- Update task position efficiently
- Create, update, delete tasks

### ✅ Task Features
- Task priority (low, medium, high)
- Assign users to tasks
- Add labels
- Checklist items
- Comments on tasks

### ✅ Type Safety
- Full TypeScript strict mode
- Shared interfaces (Frontend ↔ Backend)
- Zod validation for inputs
- API response types

---

## 🔑 Important Endpoints

### Authentication
```
POST   /api/v1/auth/register        - Register
POST   /api/v1/auth/login           - Login
POST   /api/v1/auth/refresh         - Refresh token
GET    /api/v1/auth/me              - Get current user
```

### Projects
```
GET    /api/v1/projects             - List projects (paginated)
POST   /api/v1/projects             - Create project
GET    /api/v1/projects/:id         - Get project
PUT    /api/v1/projects/:id         - Update project
DELETE /api/v1/projects/:id         - Delete project
POST   /api/v1/projects/:id/invite  - Invite member
DELETE /api/v1/projects/:id/members/:userId - Remove member
```

### Boards
```
GET    /api/v1/boards/:id           - Get board (with columns & tasks)
POST   /api/v1/boards               - Create board
PUT    /api/v1/boards/:id           - Update board
DELETE /api/v1/boards/:id           - Delete board
POST   /api/v1/boards/:id/columns   - Add column
POST   /api/v1/boards/reorder       - Reorder task ⭐
```

### Tasks
```
POST   /api/v1/tasks                - Create task
PUT    /api/v1/tasks/:id            - Update task
DELETE /api/v1/tasks/:id            - Delete task
POST   /api/v1/tasks/:id/checklist  - Add checklist item
PATCH  /api/v1/tasks/:id/checklist/:itemId/toggle - Toggle
DELETE /api/v1/tasks/:id/checklist/:itemId - Delete
POST   /api/v1/tasks/:id/comments   - Add comment
DELETE /api/v1/tasks/:id/comments/:commentId - Delete
```

---

## 🎯 Next Steps (Optional Enhancements)

### Phase 2 - Advanced Features

- [ ] Real-time updates with WebSocket (Socket.io)
- [ ] File upload for task attachments
- [ ] Email notifications for invitations
- [ ] Task activity history/timeline
- [ ] Advanced search & filtering
- [ ] Recurring tasks
- [ ] Task templates

### Phase 3 - DevOps & Deployment

- [ ] Docker containerization
- [ ] GitHub CI/CD pipeline
- [ ] Automated testing (Jest + Playwright)
- [ ] Deploy to cloud (Azure, AWS, etc.)
- [ ] Database backup & recovery

### Phase 4 - Performance & Scalability

- [ ] Caching layer (Redis)
- [ ] Database indexing optimization
- [ ] API rate limiting
- [ ] Load testing & optimization
- [ ] Monitoring & logging (ELK stack)

---

## 🛠️ Development Commands

### Frontend

```bash
cd frontend

# Development
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Lint & format
npm run lint
npm run format
```

### Backend

```bash
cd backend

# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint
```

---

## 📚 Documentation Files

1. **FRONTEND_SETUP.md** - Frontend architecture & setup
2. **BACKEND_SETUP.md** - Backend API documentation & setup
3. **frontend/README.md** - Frontend details (if created)
4. **backend/README.md** - Backend details & MongoDB schema

---

## 🐛 Debugging Tips

### Backend Console

```typescript
// Quick logging
console.log('Data:', data);
console.error('Error:', error);

// Async/await error handling
try {
  const result = await someAsyncOperation();
} catch (error) {
  console.error('Failed:', error instanceof Error ? error.message : error);
}
```

### MongoDB

```bash
# Connect to MongoDB CLI
mongosh

# List databases
show databases

# Switch database
use kanban-board

# List collections
show collections

# Find documents
db.users.find()
db.projects.find()
db.tasks.find()
```

### Frontend

```bash
# Check network requests
# Open DevTools (F12) → Network tab

# Check console errors
# DevTools → Console tab

# React component debugging
# Install React DevTools extension
```

---

## ✅ Checklist Before Deployment

- [ ] All environment variables set correctly
- [ ] MongoDB running & accessible
- [ ] Frontend connects to Backend API
- [ ] Authentication flow works (register → login → create project)
- [ ] Drag & drop works with optimistic UI
- [ ] Comments & checklist items work
- [ ] No console errors/warnings
- [ ] API response times acceptable
- [ ] All tests passing
- [ ] Build succeeds without errors

---

## 📞 Support

### Common Issues

**Issue:** "Cannot find module"
- **Fix:** Run `npm install` in the affected directory

**Issue:** Port already in use
- **Fix:** Kill the process or use different port

**Issue:** MongoDB connection failed
- **Fix:** Ensure MongoDB is running (`mongod` or Docker)

**Issue:** CORS error
- **Fix:** Check `CORS_ORIGIN` in backend `.env`

**Issue:** Token expired
- **Fix:** Use refresh token endpoint to get new token

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Router](https://reactrouter.com/)

---

## 🎉 You're Ready!

Frontend and Backend are now fully integrated. Start building amazing features!

**Questions or issues? Check the setup guides or debugging tips above.**

Happy coding! 🚀

---

**Last Updated:** 2024
**Version:** 1.0.0
**Status:** Production Ready
