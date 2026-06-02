import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useBoardStore } from '../../hooks/useBoardStore';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { Column } from '../Column';
import { TaskCard } from '../TaskCard';
import styles from './Board.module.css';

export const Board: React.FC = () => {
  const workspaces = useBoardStore((s) => s.workspaces);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);
  const activeBoardId = useBoardStore((s) => s.activeBoardId);
  const addColumn = useBoardStore((s) => s.addColumn);

  const board = workspaces
    .find((ws) => ws.id === activeWorkspaceId)
    ?.boards.find((b) => b.id === activeBoardId);

  const { activeTask, handleDragStart, handleDragOver, handleDragEnd } =
    useDragAndDrop();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    addColumn(newColumnTitle.trim());
    setNewColumnTitle('');
    setShowAddColumn(false);
  };

  if (!board) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📋</div>
        <h2 className={styles.emptyTitle}>Chưa có board nào</h2>
        <p className={styles.emptyText}>
          Chọn một board từ sidebar hoặc tạo workspace mới để bắt đầu.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        {board.columns.map((column) => {
          const tasks = column.taskIds
            .map((id) => board.tasks[id])
            .filter(Boolean);
          return <Column key={column.id} column={column} tasks={tasks} />;
        })}

        {/* ─── Nút thêm danh sách mới ─── */}
        <div className={styles.addColumnWrapper}>
          {showAddColumn ? (
            <div className={styles.addColumnCard}>
              <input
                className={styles.addColumnInput}
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddColumn();
                  if (e.key === 'Escape') { setShowAddColumn(false); setNewColumnTitle(''); }
                }}
                placeholder="Tên danh sách..."
                autoFocus
              />
              <div className={styles.addColumnActions}>
                <button className={styles.addColumnConfirm} onClick={handleAddColumn}>
                  ✓ Thêm danh sách
                </button>
                <button
                  className={styles.addColumnCancel}
                  onClick={() => { setShowAddColumn(false); setNewColumnTitle(''); }}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <button
              className={styles.addColumnBtn}
              onClick={() => setShowAddColumn(true)}
            >
              <span className={styles.addColumnIcon}>＋</span>
              Thêm danh sách
            </button>
          )}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className={styles.dragOverlay}>
            <TaskCard task={activeTask} columnId="" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
