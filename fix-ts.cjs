const fs = require('fs');

function replaceInFile(filePath, regex, replacement) {
  const content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath, content.replace(regex, replacement));
}

try {
  // 1. src/api/auth.ts
  replaceInFile('./src/api/auth.ts', 
    /import \{ AuthResponse, LoginRequest, RegisterRequest, User \} from '\.\.\/types';/, 
    "import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';"
  );

  // 2. src/api/axiosClient.ts
  replaceInFile('./src/api/axiosClient.ts',
    /import axios, \{ AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig \} from 'axios';/,
    "import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';"
  );

  // 3. src/api/board.ts
  replaceInFile('./src/api/board.ts',
    /import \{ Board, Task, CreateTaskRequest, UpdateTaskRequest, ReorderTaskRequest, ChecklistItem, CreateBoardRequest \} from '\.\.\/types';/,
    "import type { Board, Task, CreateTaskRequest, UpdateTaskRequest, ReorderTaskRequest, ChecklistItem, CreateBoardRequest } from '../types';"
  );

  // 4. src/api/project.ts
  replaceInFile('./src/api/project.ts',
    /import \{ Project, CreateProjectRequest, InviteMemberRequest, PaginatedResponse \} from '\.\.\/types';/,
    "import type { Project, CreateProjectRequest, InviteMemberRequest, PaginatedResponse } from '../types';"
  );

  // 5. src/hooks/useAuth.ts
  replaceInFile('./src/hooks/useAuth.ts',
    /import \{ User, LoginRequest, RegisterRequest \} from '\.\.\/types';/,
    "import type { User, LoginRequest, RegisterRequest } from '../types';"
  );

  // 6. src/hooks/useBoard.ts
  replaceInFile('./src/hooks/useBoard.ts',
    /import \{ Board, ReorderTaskRequest \} from '\.\.\/types';/,
    "import type { Board, ReorderTaskRequest } from '../types';"
  );

  // 7. src/hooks/useBoardStore.ts
  replaceInFile('./src/hooks/useBoardStore.ts',
    /import type \{ Board, ChecklistItem, Priority, Task, Workspace \} from '\.\.\/types\/types';/,
    "import type { Board, Priority, Task, Workspace } from '../types/types';"
  );
  replaceInFile('./src/hooks/useBoardStore.ts',
    /deleteTask: \(columnId: string, taskId: string\) => Promise<void>;/g,
    "deleteTask: (_columnId: string, taskId: string) => Promise<void>;"
  );
  replaceInFile('./src/hooks/useBoardStore.ts',
    /deleteTask: async \(columnId: string, taskId: string\): Promise<void> => \{/g,
    "deleteTask: async (_columnId: string, taskId: string): Promise<void> => {"
  );

  // 8. src/pages/KanbanPage.tsx
  replaceInFile('./src/pages/KanbanPage.tsx',
    /<Board board=\{board\} \/>/,
    "<Board />"
  );

  console.log('Fixed TS errors!');
} catch (e) {
  console.error(e);
}
