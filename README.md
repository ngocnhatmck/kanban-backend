# 📌 Kanban Board - Full Stack Application

> A modern, full-featured Kanban Board application built with React, TypeScript, Node.js, and MongoDB.

## 🎯 Quick Links

- 📖 [Project Summary](./PROJECT_SUMMARY.md) - Overview & architecture
- 🎨 [Frontend Setup](./FRONTEND_SETUP.md) - React + TypeScript setup
- 🔧 [Backend Setup](./BACKEND_SETUP.md) - Node.js + MongoDB setup
- ✨ [Complete Setup Guide](./SETUP_COMPLETE.md) - Full integration guide

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- MongoDB running locally or Docker
- npm or yarn

### 1️⃣ Start MongoDB
```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# OR install MongoDB locally
mongod
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
cp .env.example .env.local
npm run dev
```

**Output:** `✅ Server running at http://localhost:3000/api/v1`

### 3️⃣ Setup Frontend (New Terminal)
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

**Output:** `✅ Local: http://localhost:5173/`

---

## 📁 Project Structure

```
Website_QLCV/
├── frontend/                 # React + TypeScript (Port 5173)
│   ├── src/
│   │   ├── api/             # HTTP client & API services
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # Utilities
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.local
│
├── backend/                  # Node.js + Express (Port 3000)
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── controllers/     # HTTP handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilities
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local
│
├── PROJECT_SUMMARY.md        # Project overview
├── SETUP_COMPLETE.md         # Integration guide
├── FRONTEND_SETUP.md         # Frontend docs
├── BACKEND_SETUP.md          # Backend docs
└── README.md                 # This file
```

---

## 🎨 Features

### ✨ Core Features
- ✅ User authentication (Register, Login, Token Refresh)
- ✅ Project management with member invitations
- ✅ Kanban board with multiple columns
- ✅ Drag & drop tasks with optimistic UI
- ✅ Task management (Create, Read, Update, Delete)
- ✅ Checklist items for tasks
- ✅ Comments on tasks
- ✅ Task priorities and labels
- ✅ User assignment to tasks

### 🔐 Security Features
- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication with refresh tokens
- ✅ CORS protection
- ✅ Input validation (Zod)
- ✅ Security headers (Helmet)
- ✅ Protected API routes

### ⚡ Performance Features
- ✅ Optimistic UI updates
- ✅ Efficient database queries
- ✅ Token refresh handling
- ✅ Pagination on lists

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.6 | UI Framework |
| TypeScript | 6.0.2 | Type Safety |
| Vite | 8.0.12 | Build Tool |
| Axios | 1.6.0 | HTTP Client |
| Zustand | 5.0.14 | State Management |
| React Router | 6.20.0 | Routing |
| @dnd-kit | 6.3.1 | Drag & Drop |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Express | 4.18.2 | Web Framework |
| MongoDB | 8.0.0 | Database |
| Mongoose | Latest | ODM |
| TypeScript | 5.3.2 | Type Safety |
| JWT | 9.1.2 | Authentication |
| Zod | 3.22.4 | Validation |

---

## 📚 API Endpoints

### Authentication
```
POST   /api/v1/auth/register        - Register new user
POST   /api/v1/auth/login           - Login user
POST   /api/v1/auth/refresh         - Refresh token
GET    /api/v1/auth/me              - Get current user (protected)
```

### Projects
```
GET    /api/v1/projects             - List projects (paginated)
POST   /api/v1/projects             - Create project
GET    /api/v1/projects/:id         - Get project details
PUT    /api/v1/projects/:id         - Update project
DELETE /api/v1/projects/:id         - Delete project
POST   /api/v1/projects/:id/invite  - Invite member
DELETE /api/v1/projects/:id/members/:userId - Remove member
```

### Boards & Columns
```
GET    /api/v1/boards/:id           - Get board with columns & tasks
POST   /api/v1/boards               - Create board
PUT    /api/v1/boards/:id           - Update board
DELETE /api/v1/boards/:id           - Delete board
POST   /api/v1/boards/:id/columns   - Add column
```

### Tasks
```
POST   /api/v1/tasks                - Create task
PUT    /api/v1/tasks/:id            - Update task
DELETE /api/v1/tasks/:id            - Delete task
POST   /api/v1/tasks/reorder        - Reorder task (drag & drop)
POST   /api/v1/tasks/:id/checklist  - Add checklist item
PATCH  /api/v1/tasks/:id/checklist/:itemId/toggle - Toggle item
DELETE /api/v1/tasks/:id/checklist/:itemId - Delete item
POST   /api/v1/tasks/:id/comments   - Add comment
DELETE /api/v1/tasks/:id/comments/:commentId - Delete comment
```

---

## 🧪 Testing

### Manual Testing

1. **Register & Login**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"pass123","name":"Test"}'
   ```

2. **Create Project**
   ```bash
   curl -X POST http://localhost:3000/api/v1/projects \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"title":"My Project"}'
   ```

3. **Test via Frontend**
   - Open http://localhost:5173
   - Register or login
   - Create a project
   - Create a board
   - Drag & drop tasks

---

## 📝 Development

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

### Backend Development
```bash
cd backend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🔄 How It Works

### Architecture Overview

```
┌─────────────────────────────────┐
│   Frontend (React)              │
│   http://localhost:5173         │
│ ├─ Pages (KanbanPage, etc)      │
│ ├─ Components (Board, Column)   │
│ ├─ Hooks (useBoard, useAuth)    │
│ └─ API Client (Axios)           │
└────────────┬────────────────────┘
             │ HTTP/REST
             ↓
┌─────────────────────────────────┐
│   Backend (Express)             │
│   http://localhost:3000         │
│ ├─ Routes (/api/v1/...)         │
│ ├─ Controllers (HTTP handlers)  │
│ ├─ Services (Business logic)    │
│ ├─ Middleware (JWT auth)        │
│ └─ Models (MongoDB schemas)     │
└────────────┬────────────────────┘
             │ Database Queries
             ↓
┌─────────────────────────────────┐
│   MongoDB Database              │
│   localhost:27017               │
│ ├─ users (User accounts)        │
│ ├─ projects (Projects)          │
│ ├─ boards (Kanban boards)       │
│ ├─ columns (Board columns)      │
│ ├─ tasks (Tasks in columns)     │
│ └─ comments (Task comments)     │
└─────────────────────────────────┘
```

### Request Flow

```
1. User interacts with Frontend UI
   ↓
2. React component calls API method
   ↓
3. Axios sends HTTP request with JWT token
   ↓
4. Backend Express router receives request
   ↓
5. Controller validates input (Zod)
   ↓
6. Service executes business logic
   ↓
7. Model interacts with MongoDB
   ↓
8. Response returns to Frontend
   ↓
9. Frontend updates UI (optimistic or server data)
```

---

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Deploy dist/ to static server
```

### Environment Variables

Create `.env.local` in both `frontend/` and `backend/`:

**Backend `.env.local`:**
```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kanban
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
CORS_ORIGIN=https://yourdomain.com
```

**Frontend `.env.local`:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_ENV=production
```

---

## 📖 Documentation

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project overview
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Integration guide with examples
- **[FRONTEND_SETUP.md](./FRONTEND_SETUP.md)** - Frontend architecture
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Backend API documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend details
- **[backend/README.md](./backend/README.md)** - Backend details

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
# Option 1: Docker
docker ps | grep mongo

# Option 2: Local
mongod

# Option 3: Start MongoDB
docker run -d -p 27017:27017 mongo:latest
```

### Port Already in Use
```bash
# Check what's using the port
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000

# Kill the process
taskkill /PID <PID> /F
```

### CORS Error
```bash
# Check Backend CORS_ORIGIN in .env
CORS_ORIGIN=http://localhost:5173

# Check Frontend API_BASE_URL in .env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Token Expired
```bash
# Frontend automatically refreshes token
# If still failing, login again to get new token
```

---

## 📋 Checklist

- [ ] Clone the repository
- [ ] Install Node.js 18+
- [ ] Install MongoDB (Docker or local)
- [ ] Setup Backend (.env + npm install)
- [ ] Setup Frontend (.env + npm install)
- [ ] Run `npm run dev` in both directories
- [ ] Test authentication (register → login)
- [ ] Create project → board → task
- [ ] Test drag & drop functionality

---

## 🤝 Contributing

Feel free to fork and submit pull requests for any improvements!

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the setup guides in the documentation
3. Check console/terminal for error messages
4. Verify environment variables are set correctly

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## ✨ Credits

Built with ❤️ as a full-stack learning project.

---

**Happy Coding! 🚀**

For detailed setup and API documentation, see the [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) file.
