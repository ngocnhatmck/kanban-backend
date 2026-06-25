/**
 * Auth Service
 * - Register user
 * - Login user
 * - Verify token
 * - Get user by ID
 */

import { User } from '../models/User.js';
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
} from '../utils/jwt.js';
import { IUser } from '../types/index.js';

export class AuthService {
  /**
   * Register new user
   */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: IUser; token: string; refreshToken: string }> {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();

    // Generate tokens
    const token = generateToken(newUser._id.toString(), newUser.email);
    const refreshToken = generateRefreshToken(
      newUser._id.toString(),
      newUser.email
    );

    return {
      user: newUser.toObject(),
      token,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string; refreshToken: string }> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const token = generateToken(user._id.toString(), user.email);
    const refreshToken = generateRefreshToken(
      user._id.toString(),
      user.email
    );

    return {
      user: user.toObject(),
      token,
      refreshToken,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    return user ? user.toObject() : null;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email });
    return user ? user.toObject() : null;
  }
}

export default new AuthService();
