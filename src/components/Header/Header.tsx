import { useNavigate } from 'react-router-dom';
import { useBoardStore } from '../../hooks/useBoardStore';
import { useAuth } from '../../hooks/useAuth';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const workspaces = useBoardStore((s) => s.workspaces);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);
  const activeBoardId = useBoardStore((s) => s.activeBoardId);
  const { user, logout } = useAuth();

  const board = workspaces
    .find((ws) => ws.id === activeWorkspaceId)
    ?.boards.find((b) => b.id === activeBoardId);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{board?.title ?? 'Kanban Board'}</h1>
        {board?.description && (
          <p className={styles.description}>{board.description}</p>
        )}
      </div>

      <div className={styles.right}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Tìm kiếm công việc..."
            readOnly
          />
        </div>

        <div className={styles.userSection}>
          <span className={styles.userEmail}>{user?.name || user?.email}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
};
