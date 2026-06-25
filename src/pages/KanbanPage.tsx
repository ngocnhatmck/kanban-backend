/**
 * Page: Kanban Board
 * - Fetch board từ API
 * - Render Board component
 * - Handle drag & drop reorder tasks
 */

import { useParams } from 'react-router-dom';
import { Board } from '../components/Board';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import useBoard from '../hooks/useBoard';
import styles from './KanbanPage.module.css';

export function KanbanPage() {
  const { boardId } = useParams<{ boardId: string }>();

  if (!boardId) {
    return <div className={styles.error}>Board ID không tìm thấy</div>;
  }

  const { board, isLoading, error } = useBoard(boardId);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.main}>
          <Header />
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.main}>
          <Header />
          <div className={styles.error}>
            Lỗi: {error.message}
          </div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.main}>
          <Header />
          <div className={styles.error}>Không tìm thấy board</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <div className={styles.content}>
          <Board />
        </div>
      </div>
    </div>
  );
}

export default KanbanPage;
