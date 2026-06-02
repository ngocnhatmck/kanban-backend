import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types/types';
import { Badge } from '../common/Badge';
import { useBoardStore } from '../../hooks/useBoardStore';
import { TaskModal } from '../TaskModal';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  columnId: string;
}

const priorityVariantMap = {
  high: 'priority-high',
  medium: 'priority-medium',
  low: 'priority-low',
} as const;

const priorityLabel: Record<string, string> = {
  high: 'Cao',
  medium: 'TB',
  low: 'Thấp',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, columnId }) => {
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const [showModal, setShowModal] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'task', task, columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(columnId, task.id);
  };

  const handleCardClick = () => setShowModal(true);

  const formattedDate = new Date(task.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit',
  });

  const doneCount = task.checklist.filter((i) => i.done).length;
  const totalCount = task.checklist.length;
  const checkPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleCardClick}
        className={`${styles.card} ${styles[`border-${task.priority}`]} ${isDragging ? styles.dragging : ''}`}
      >
        {/* Priority stripe */}
        <div className={styles.stripe} data-priority={task.priority} />

        <div className={styles.cardInner}>
          {/* Header */}
          <div className={styles.cardHeader}>
            <h4 className={styles.title}>{task.title}</h4>
            <button
              className={styles.deleteButton}
              onClick={handleDelete}
              type="button"
              aria-label="Xoá thẻ"
            >
              ✕
            </button>
          </div>

          {/* Description */}
          {task.description && (
            <p className={styles.description}>
              {task.description.length > 90
                ? `${task.description.slice(0, 90)}…`
                : task.description}
            </p>
          )}

          {/* Checklist progress */}
          {totalCount > 0 && (
            <div className={styles.checklistMeta}>
              <div className={styles.checkBar}>
                <div
                  className={styles.checkFill}
                  style={{ width: `${checkPct}%` }}
                  data-complete={checkPct === 100}
                />
              </div>
              <span
                className={styles.checkCount}
                data-complete={checkPct === 100}
              >
                {doneCount}/{totalCount}
              </span>
            </div>
          )}

          {/* Meta */}
          <div className={styles.meta}>
            <div className={styles.badges}>
              <Badge variant={priorityVariantMap[task.priority]}>
                {priorityLabel[task.priority]}
              </Badge>
              {task.labels.slice(0, 2).map((label) => (
                <Badge key={label} variant="label">{label}</Badge>
              ))}
              {task.labels.length > 2 && (
                <span className={styles.moreLabels}>+{task.labels.length - 2}</span>
              )}
            </div>
            <span className={styles.date}>{formattedDate}</span>
          </div>
        </div>
      </div>

      {showModal && (
        <TaskModal task={task} columnId={columnId} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};
