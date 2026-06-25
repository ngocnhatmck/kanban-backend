/**
 * Board Model
 * Một Board có nhiều Column
 */

import mongoose from 'mongoose';
import { IBoard } from '../types/index.js';

const boardSchema = new mongoose.Schema<IBoard>(
  {
    projectId: {
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
    columns: {
      type: [String], // Column IDs
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Board = mongoose.model<IBoard>('Board', boardSchema);
