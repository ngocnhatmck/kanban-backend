/**
 * Column Model
 * Một Column có nhiều Task
 */

import mongoose from 'mongoose';
import { IColumn } from '../types/index.js';

const columnSchema = new mongoose.Schema<IColumn>(
  {
    boardId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    index: {
      type: Number,
      required: true,
      default: 0,
    },
    taskIds: {
      type: [String], // Task IDs
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Column = mongoose.model<IColumn>('Column', columnSchema);
