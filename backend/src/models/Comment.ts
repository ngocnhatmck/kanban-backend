/**
 * Comment Model
 */

import mongoose from 'mongoose';
import { IComment } from '../types/index.js';

const commentSchema = new mongoose.Schema<IComment>(
  {
    taskId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
