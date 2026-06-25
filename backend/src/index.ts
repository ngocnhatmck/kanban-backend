/**
 * Main Application Entry Point
 */

import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/database.js';

// Routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/project.js';
import boardRoutes from './routes/board.js';
import taskRoutes from './routes/task.js';
import { createServer } from 'http';
import { initSocket } from './utils/socket.js';

const app: Express = express();
const httpServer = createServer(app);
initSocket(httpServer);
const PORT = process.env.PORT || 3000;

// ============================================================================
// Middleware
// ============================================================================

// Security
app.use(helmet());

// CORS — cho phép tất cả localhost (5173, 5174, ...) trong development
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      // Cho phép tất cả localhost với bất kỳ port nào
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
      // Kiểm tra danh sách whitelist
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// Routes
// ============================================================================

const apiV1 = '/api/v1';

app.use(`${apiV1}/auth`, authRoutes);
app.use(`${apiV1}/projects`, projectRoutes);
app.use(`${apiV1}/boards`, boardRoutes);
app.use(`${apiV1}/tasks`, taskRoutes);

// Health check
app.get(`${apiV1}/health`, (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(
  (
    err: any,
    _req: Request,
    res: Response,
    _next: (error?: any) => void
  ) => {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
);

// ============================================================================
// Start Server
// ============================================================================

async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    httpServer.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api/v1`);
      console.log(`🔌 Socket.io initialized`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
