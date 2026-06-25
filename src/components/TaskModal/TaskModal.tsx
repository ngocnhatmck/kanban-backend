import { useState, useEffect, useRef } from 'react';
import type { Task, Priority } from '../../types/types';
import { useBoardStore } from '../../hooks/useBoardStore';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import styles from './TaskModal.module.css';

interface TaskModalProps {
  task: Task;
  columnId: string;
  onClose: () => void;
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const PRIORITY_LABELS: Record<Priority, string> = {
  low: '🟢 Thấp',
  medium: '🟡 Trung bình',
  high: '🔴 Cao',
};

export const TaskModal: React.FC<TaskModalProps> = ({ task, columnId, onClose }) => {
  const updateTask = useBoardStore((s) => s.updateTask);
  // Reactive: subscribe trực tiếp vào workspaces để lấy live task
  const workspaces = useBoardStore((s) => s.workspaces);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);
  const activeBoardId = useBoardStore((s) => s.activeBoardId);
  const activeBoard = workspaces
    .find((ws) => ws.id === activeWorkspaceId)
    ?.boards.find((b) => b.id === activeBoardId);
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const addChecklistItem = useBoardStore((s) => s.addChecklistItem);
  const toggleChecklistItem = useBoardStore((s) => s.toggleChecklistItem);
  const deleteChecklistItem = useBoardStore((s) => s.deleteChecklistItem);

  // Lấy live task từ reactive selector
  const liveTask = activeBoard?.tasks[task.id] ?? task;

  const [title, setTitle] = useState(liveTask.title);
  const [description, setDescription] = useState(liveTask.description ?? '');
  const [priority, setPriority] = useState<Priority>(liveTask.priority);
  const [labelInput, setLabelInput] = useState('');
  const [newCheckText, setNewCheckText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dirty, setDirty] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const handleClose = () => {
    if (dirty) handleSave();
    onClose();
  };

  const handleSave = () => {
    if (!title.trim()) return;
    updateTask(task.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      labels: liveTask.labels,
    });
    setDirty(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    deleteTask(columnId, task.id);
    onClose();
  };

  const handleAddLabel = () => {
    const label = labelInput.trim();
    if (!label || liveTask.labels.includes(label)) return;
    updateTask(task.id, { labels: [...liveTask.labels, label] });
    setLabelInput('');
  };

  const handleRemoveLabel = (label: string) => {
    updateTask(task.id, { labels: liveTask.labels.filter((l) => l !== label) });
  };

  const handleAddChecklist = () => {
    if (!newCheckText.trim()) return;
    addChecklistItem(task.id, newCheckText.trim());
    setNewCheckText('');
  };

  const doneCount = liveTask.checklist.filter((i) => i.done).length;
  const totalCount = liveTask.checklist.length;
  const checkPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* Header */}
        <div className={styles.modalHeader}>
          <span className={styles.priorityDot} data-priority={priority} />
          <input
            ref={titleRef}
            className={styles.titleInput}
            value={title}
            onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
            placeholder="Tiêu đề công việc..."
          />
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Đóng">✕</button>
        </div>

        <div className={styles.modalBody}>
          {/* Left column */}
          <div className={styles.leftCol}>
            {/* Description */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>📝 Mô tả</h3>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={(content) => { setDescription(content); setDirty(true); }}
                className={styles.quillEditor}
                placeholder="Thêm mô tả chi tiết cho công việc..."
              />
            </section>

            {/* Checklist */}
            <section className={styles.section}>
              <div className={styles.checklistHeader}>
                <h3 className={styles.sectionTitle}>✅ Danh sách công việc</h3>
                {totalCount > 0 && (
                  <span className={styles.checkProgress}>{doneCount}/{totalCount}</span>
                )}
              </div>

              {totalCount > 0 && (
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${checkPct}%` }}
                    data-complete={checkPct === 100}
                  />
                </div>
              )}

              <div className={styles.checklist}>
                {liveTask.checklist.map((item) => (
                  <div key={item.id} className={styles.checkItem}>
                    <button
                      className={`${styles.checkBox} ${item.done ? styles.checked : ''}`}
                      onClick={() => toggleChecklistItem(task.id, item.id)}
                      aria-label={item.done ? 'Đánh dấu chưa xong' : 'Đánh dấu xong'}
                    >
                      {item.done && '✓'}
                    </button>
                    <span className={`${styles.checkText} ${item.done ? styles.checkDone : ''}`}>
                      {item.text}
                    </span>
                    <button
                      className={styles.checkDelete}
                      onClick={() => deleteChecklistItem(task.id, item.id)}
                      aria-label="Xoá mục"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.addCheckRow}>
                <input
                  className={styles.checkInput}
                  value={newCheckText}
                  onChange={(e) => setNewCheckText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
                  placeholder="Thêm mục công việc..."
                />
                <button className={styles.addCheckBtn} onClick={handleAddChecklist}>
                  + Thêm
                </button>
              </div>
            </section>
          </div>

          {/* Right sidebar */}
          <div className={styles.rightCol}>
            {/* Priority */}
            <section className={styles.sideSection}>
              <h4 className={styles.sideSectionTitle}>Ưu tiên</h4>
              <div className={styles.priorityGroup}>
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    className={`${styles.priorityBtn} ${priority === p ? styles.priorityActive : ''}`}
                    data-priority={p}
                    onClick={() => { setPriority(p); setDirty(true); }}
                  >
                    {PRIORITY_LABELS[p]}
                  </button>
                ))}
              </div>
            </section>

            {/* Labels */}
            <section className={styles.sideSection}>
              <h4 className={styles.sideSectionTitle}>Nhãn</h4>
              <div className={styles.labels}>
                {liveTask.labels.map((label) => (
                  <span key={label} className={styles.label}>
                    {label}
                    <button
                      className={styles.labelRemove}
                      onClick={() => handleRemoveLabel(label)}
                      aria-label={`Xoá nhãn ${label}`}
                    >✕</button>
                  </span>
                ))}
              </div>
              <div className={styles.addLabelRow}>
                <input
                  className={styles.labelInput}
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddLabel()}
                  placeholder="Tên nhãn..."
                />
                <button className={styles.addLabelBtn} onClick={handleAddLabel}>+</button>
              </div>
            </section>

            {/* Created date */}
            <section className={styles.sideSection}>
              <h4 className={styles.sideSectionTitle}>Ngày tạo</h4>
              <p className={styles.dateText}>
                {new Date(liveTask.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                })}
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button
            className={`${styles.deleteBtn} ${confirmDelete ? styles.confirmDelete : ''}`}
            onClick={handleDelete}
          >
            {confirmDelete ? '⚠️ Xác nhận xoá?' : '🗑 Xoá thẻ'}
          </button>
          {confirmDelete && (
            <button className={styles.cancelBtn} onClick={() => setConfirmDelete(false)}>
              Huỷ
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button className={styles.saveBtn} onClick={() => { handleSave(); onClose(); }}>
            💾 Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};
