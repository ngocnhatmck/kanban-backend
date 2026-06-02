import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Column as ColumnType, Task } from '../../types/types';
import { TaskCard } from '../TaskCard';
import { AddTaskForm } from '../AddTaskForm';
import styles from './Column.module.css';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

const columnColorMap: Record<string, string> = {
  todo: '#48dbfb',
  'to do': '#48dbfb',
  doing: '#feca57',
  'in progress': '#feca57',
  done: '#2ed573',
  completed: '#2ed573',
};

function getColumnDotColor(title: string): string {
  const key = title.toLowerCase().trim();
  return columnColorMap[key] ?? '#6c63ff';
}

export const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      columnId: column.id,
    },
  });

  const dotColor = getColumnDotColor(column.title);

  return (
    <div
      className={`${styles.column} ${isOver ? styles.columnOver : ''}`}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.dot} style={{ backgroundColor: dotColor }} />
          <h3 className={styles.title}>{column.title}</h3>
        </div>
        <span className={styles.count}>{tasks.length}</span>
      </div>

      <SortableContext
        items={column.taskIds}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className={styles.taskList}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} columnId={column.id} />
          ))}
          {tasks.length === 0 && (
            <div className={styles.emptyColumn}>
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>

      <div className={styles.footer}>
        {showAddForm ? (
          <AddTaskForm columnId={column.id} onClose={() => setShowAddForm(false)} />
        ) : (
          <button
            className={styles.addButton}
            onClick={() => setShowAddForm(true)}
            type="button"
          >
            <span className={styles.addIcon}>+</span>
            Add task
          </button>
        )}
      </div>
    </div>
  );
};
