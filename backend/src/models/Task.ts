/**
 * Task Model
 * Một Task có thể có nhiều Checklist items và Comments
 */

import mongoose from 'mongoose';
import { ITask } from '../types/index.js';

const checklistItemSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema<ITask>(
  {
    boardId: {
      type: String,
      required: true,
    },
    columnId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: undefined,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    assignees: {
      type: [String], // User IDs
      default: [],
    },
    labels: {
      type: [String],
      default: [],
    },
    checklist: {
      type: [checklistItemSchema],
      default: [],
    },
    commentIds: {
      type: [String], // Comment IDs
      default: [],
    },
    index: {
      type: Number,
      required: true,
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model<ITask>('Task', taskSchema);
