import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './src/models/User.js';

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban-board';
    await mongoose.connect(mongoUri);
    const hashed = await bcrypt.hash('123456', 10);
    await User.findOneAndUpdate(
      { email: 'demo@example.com' },
      { name: 'Demo User', email: 'demo@example.com', password: hashed },
      { upsert: true }
    );
    console.log('Demo user seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
