# 📚 Quick Reference Guide

## 🚀 Start Development (Copy & Paste)

### Terminal 1: MongoDB
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Terminal 2: Backend
```bash
cd backend
npm install
cp .env.example .env.local
npm run dev
```

### Terminal 3: Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

**Done!** 
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

---

## 🔗 API Quick Test

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"pass123",
    "name":"Test User"
  }'
```

**Save:** `token` and `refreshToken`

### 2. Create Project
```bash
TOKEN="your_token_here"

curl -X POST http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My Project",
    "description":"Test project"
  }'
```

**Save:** `_id` as `PROJECT_ID`

### 3. Create Board
```bash
TOKEN="your_token_here"
PROJECT_ID="project_id_here"

curl -X POST "http://localhost:3000/api/v1/boards?projectId=$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Kanban Board",
    "description":"Main board"
  }'
```

**Save:** `_id` as `BOARD_ID`

### 4. Get Board
```bash
TOKEN="your_token_here"
BOARD_ID="board_id_here"

curl -X GET http://localhost:3000/api/v1/boards/$BOARD_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📁 File Locations

### Frontend
- **API Client**: `frontend/src/api/axiosClient.ts`
- **Auth Hook**: `frontend/src/hooks/useAuth.ts`
- **Board Hook**: `frontend/src/hooks/useBoard.ts`
- **Types**: `frontend/src/types/index.ts`
- **Config**: `frontend/.env.local`

### Backend
- **Main Entry**: `backend/src/index.ts`
- **Database**: `backend/src/config/database.ts`
- **Auth Service**: `backend/src/services/AuthService.ts`
- **Board Service**: `backend/src/services/BoardService.ts`
- **Task Service**: `backend/src/services/TaskService.ts`
- **Auth Routes**: `backend/src/routes/auth.ts`
- **Models**: `backend/src/models/`
- **Config**: `backend/.env.local`

---

## 🔑 Important Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 3000 | http://localhost:3000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

---

## 📝 Environment Variables

### Backend (`.env.local`)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kanban-board
JWT_SECRET=your_secret_key_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_here_min_32_chars
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`.env.local`)
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_ENV=development
```

---

## 🧪 Common API Requests

### Authentication

**Register:**
```bash
POST /api/v1/auth/register
Body: { email, password, name }
```

**Login:**
```bash
POST /api/v1/auth/login
Body: { email, password }
```

**Refresh Token:**
```bash
POST /api/v1/auth/refresh
Body: { refreshToken }
```

**Get Me:**
```bash
GET /api/v1/auth/me
Header: Authorization: Bearer <token>
```

### Projects

**List:**
```bash
GET /api/v1/projects?page=1&pageSize=10
Header: Authorization: Bearer <token>
```

**Create:**
```bash
POST /api/v1/projects
Header: Authorization: Bearer <token>
Body: { title, description? }
```

**Get:**
```bash
GET /api/v1/projects/<id>
Header: Authorization: Bearer <token>
```

**Update:**
```bash
PUT /api/v1/projects/<id>
Header: Authorization: Bearer <token>
Body: { title?, description? }
```

**Delete:**
```bash
DELETE /api/v1/projects/<id>
Header: Authorization: Bearer <token>
```

### Boards

**Get (with columns & tasks):**
```bash
GET /api/v1/boards/<boardId>
Header: Authorization: Bearer <token>
```

**Create:**
```bash
POST /api/v1/boards?projectId=<projectId>
Header: Authorization: Bearer <token>
Body: { title, description? }
```

**Reorder Task:**
```bash
POST /api/v1/boards/reorder?boardId=<boardId>
Header: Authorization: Bearer <token>
Body: {
  "taskId": "task-id",
  "fromColumnId": "column-1",
  "fromIndex": 0,
  "toColumnId": "column-2",
  "toIndex": 1
}
```

### Tasks

**Create:**
```bash
POST /api/v1/tasks
Header: Authorization: Bearer <token>
Body: {
  "boardId": "board-id",
  "columnId": "column-id",
  "title": "Task title",
  "description?": "...",
  "priority?": "low|medium|high"
}
```

**Update:**
```bash
PUT /api/v1/tasks/<taskId>
Header: Authorization: Bearer <token>
Body: { title?, priority?, assignees?, labels? }
```

**Delete:**
```bash
DELETE /api/v1/tasks/<taskId>
Header: Authorization: Bearer <token>
```

---

## 🛠️ Development Commands

### Frontend
```bash
cd frontend

npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # Run linter
npm run format       # Format code
```

### Backend
```bash
cd backend

npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run linter
npm run format       # Format code
```

---

## 🐛 Debugging Commands

### Check Port Usage
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# macOS/Linux
lsof -i :3000
lsof -i :5173
```

### Kill Process
```bash
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

### MongoDB Commands
```bash
# Connect to MongoDB
mongosh

# List databases
show databases

# Use database
use kanban-board

# List collections
show collections

# Find documents
db.users.find()
db.projects.find()
db.tasks.find()

# Count documents
db.users.countDocuments()

# Clear collection
db.users.deleteMany({})
```

---

## 📊 Database Schema Quick Ref

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  avatar: String?,
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  _id: ObjectId,
  title: String,
  description: String?,
  ownerId: String,
  members: [{
    userId: String,
    email: String,
    role: "admin" | "member",
    joinedAt: Date
  }],
  boards: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  _id: ObjectId,
  boardId: String,
  columnId: String,
  title: String,
  description: String?,
  priority: "low" | "medium" | "high",
  assignees: [String],
  labels: [String],
  checklist: [{
    _id: ObjectId,
    text: String,
    done: Boolean
  }],
  commentIds: [ObjectId],
  index: Number,
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 JWT Token Flow

```
1. User registers/logs in
   → Backend generates token + refreshToken
   → Frontend stores in localStorage

2. Each API request
   → Axios adds "Authorization: Bearer <token>"
   → Backend verifies token with JWT middleware

3. Token expires (401 response)
   → Frontend sends refreshToken to /auth/refresh
   → Backend returns new token
   → Frontend stores new token
   → Retry original request

4. Logout
   → Frontend removes tokens from localStorage
   → Backend doesn't need to do anything
```

---

## 📖 Documentation Map

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `SETUP_COMPLETE.md` | Full setup guide |
| `PROJECT_SUMMARY.md` | Architecture overview |
| `CHECKLIST.md` | Validation checklist |
| `QUICK_REFERENCE.md` | This file |
| `FRONTEND_SETUP.md` | Frontend details |
| `BACKEND_SETUP.md` | Backend & API docs |

---

## 🚀 Production Deployment

### Build Both
```bash
cd frontend && npm run build
cd ../backend && npm run build
```

### Environment Setup
```bash
# Create production .env files
# Update MONGODB_URI to production database
# Update JWT_SECRET with strong value
# Update CORS_ORIGIN to production domain
# Update VITE_API_BASE_URL to production URL
```

### Start Services
```bash
# Backend
cd backend && npm start

# Frontend (serve dist/ folder)
# Use: Vercel, Netlify, AWS S3+CloudFront, etc.
```

---

## 🎯 Key Features Checklist

- ✅ User registration & login
- ✅ JWT token refresh
- ✅ Project management
- ✅ Member invitations
- ✅ Kanban board with columns
- ✅ Task CRUD operations
- ✅ Drag & drop with optimistic UI
- ✅ Checklist items
- ✅ Comments on tasks
- ✅ Task priorities & labels
- ✅ User assignment to tasks
- ✅ Password hashing
- ✅ Input validation (Zod)
- ✅ Error handling
- ✅ TypeScript strict mode
- ✅ CORS support
- ✅ Security headers

---

## 💡 Pro Tips

1. **Use Postman/Insomnia** for API testing
2. **Browser DevTools** to check network requests
3. **MongoDB Compass** to visualize database
4. **React DevTools** extension for component debugging
5. **VSCode REST Client** extension for quick API testing
6. **Use environment variables** for secrets, never commit them
7. **Run `npm audit`** regularly to check vulnerabilities
8. **Keep dependencies updated** with `npm update`
9. **Use `.gitignore`** to exclude `node_modules/` and `.env`
10. **Write meaningful git commits** for tracking changes

---

## 🔗 Useful Links

- [React Docs](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [JWT Introduction](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

## ⏰ Estimated Times

| Task | Time |
|------|------|
| Setup Backend | 10 min |
| Setup Frontend | 10 min |
| Manual API Testing | 15 min |
| Full Feature Testing | 30 min |
| First Deployment | 60 min |

---

**Created:** 2024  
**Last Updated:** 2024  
**Version:** 1.0.0

For detailed information, see the full documentation files listed above.
