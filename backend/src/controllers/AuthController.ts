/**
 * Auth Controller
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import authService from '../services/AuthService.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { ApiResponse } from '../types/index.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export class AuthController {
  /**
   * POST /auth/register
   */
  async register(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { email, password, name } = registerSchema.parse(req.body);

      const { user, token, refreshToken } = await authService.register(
        email,
        password,
        name
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
          },
          token,
          refreshToken,
        },
        message: 'Registration successful',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /auth/login
   */
  async login(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const { user, token, refreshToken } = await authService.login(
        email,
        password
      );

      res.status(200).json({
        success: true,
        data: {
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
          },
          token,
          refreshToken,
        },
        message: 'Login successful',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json({
        success: false,
        message,
      });
    }
  }

  /**
   * POST /auth/refresh
   */
  async refresh(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
        return;
      }

      const payload = verifyRefreshToken(refreshToken);

      if (!payload) {
        res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
        });
        return;
      }

      const user = await authService.getUserById(payload.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      const newToken = generateToken(user._id.toString(), user.email);
      const newRefreshToken = generateRefreshToken(
        user._id.toString(),
        user.email
      );

      res.status(200).json({
        success: true,
        data: {
          token: newToken,
          refreshToken: newRefreshToken,
        },
        message: 'Token refreshed',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Token refresh failed',
      });
    }
  }

  /**
   * GET /auth/me
   */
  async getMe(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const user = await authService.getUserById(req.user.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
        message: 'User info fetched',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user info',
      });
    }
  }
}

export default new AuthController();
