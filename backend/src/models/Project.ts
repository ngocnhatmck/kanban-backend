/**
 * Project Model
 * Một Project có nhiều Board
 * Một Project có nhiều Member (User)
 */

import mongoose from 'mongoose';
import { IProject } from '../types/index.js';

const projectMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: undefined,
    },
    ownerId: {
      type: String,
      required: true,
    },
    members: {
      type: [projectMemberSchema],
      default: [],
    },
    boards: {
      type: [String], // Board IDs
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);
