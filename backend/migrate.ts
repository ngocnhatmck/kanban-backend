import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import { Project } from './src/models/Project.js';
import { Board } from './src/models/Board.js';
import { Column } from './src/models/Column.js';
import { Task } from './src/models/Task.js';
import { Comment } from './src/models/Comment.js';

const LOCAL_URI = 'mongodb://localhost:27017/kanban-board';
const REMOTE_URI = process.env.MONGODB_URI;

if (!REMOTE_URI || REMOTE_URI.includes('localhost')) {
  console.error('❌ MONGODB_URI in backend/.env is not configured for Atlas (must not be localhost).');
  process.exit(1);
}

async function migrate() {
  try {
    console.log('🔌 Connecting to local MongoDB...');
    const localConnection = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Connected to local MongoDB.');

    // Fetch all data from local
    console.log('📦 Fetching data from local database...');
    const users = await localConnection.model('User', User.schema).find({});
    const projects = await localConnection.model('Project', Project.schema).find({});
    const boards = await localConnection.model('Board', Board.schema).find({});
    const columns = await localConnection.model('Column', Column.schema).find({});
    const tasks = await localConnection.model('Task', Task.schema).find({});
    const comments = await localConnection.model('Comment', Comment.schema).find({});

    console.log(`📊 Local data found:
    - Users: ${users.length}
    - Projects: ${projects.length}
    - Boards: ${boards.length}
    - Columns: ${columns.length}
    - Tasks: ${tasks.length}
    - Comments: ${comments.length}
    `);

    await localConnection.close();
    console.log('🔌 Closed local MongoDB connection.');

    console.log('🔌 Connecting to remote MongoDB Atlas...');
    const remoteConnection = await mongoose.createConnection(REMOTE_URI).asPromise();
    console.log('✅ Connected to remote MongoDB Atlas.');

    // Function to migrate a collection
    const migrateCollection = async (name: string, schema: any, data: any[]) => {
      if (data.length === 0) {
        console.log(`ℹ️ No data to migrate for ${name}.`);
        return;
      }
      const model = remoteConnection.model(name, schema);
      console.log(`🗑️ Clearing existing ${name} in Atlas...`);
      await model.deleteMany({});
      console.log(`📥 Inserting ${data.length} ${name} documents into Atlas...`);
      await model.insertMany(data);
      console.log(`✅ Successfully migrated ${name}.`);
    };

    await migrateCollection('User', User.schema, users);
    await migrateCollection('Project', Project.schema, projects);
    await migrateCollection('Board', Board.schema, boards);
    await migrateCollection('Column', Column.schema, columns);
    await migrateCollection('Task', Task.schema, tasks);
    await migrateCollection('Comment', Comment.schema, comments);

    await remoteConnection.close();
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
