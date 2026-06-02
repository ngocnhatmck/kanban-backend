import { useState, useRef, useEffect } from 'react';
import type { Priority } from '../../types/types';
import { useBoardStore } from '../../hooks/useBoardStore';
import { Button } from '../common/Button';
import styles from './AddTaskForm.module.css';

interface AddTaskFormProps {
  columnId: string;
  onClose: () => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ columnId, onClose }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const inputRef = useRef<HTMLInputElement>(null);
  const addTask = useBoardStore((state) => state.addTask);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    addTask(columnId, trimmed, priority);
    onClose();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        placeholder="Task title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoComplete="off"
      />

      <select
        className={styles.select}
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="low">🔵 Low</option>
        <option value="medium">🟡 Medium</option>
        <option value="high">🔴 High</option>
      </select>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" size="sm">
          Add
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
