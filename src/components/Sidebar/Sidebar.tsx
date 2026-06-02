import { useState } from 'react';
import { useBoardStore } from '../../hooks/useBoardStore';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  const workspaces = useBoardStore((s) => s.workspaces);
  const activeWorkspaceId = useBoardStore((s) => s.activeWorkspaceId);
  const activeBoardId = useBoardStore((s) => s.activeBoardId);
  const setActiveWorkspace = useBoardStore((s) => s.setActiveWorkspace);
  const setActiveBoard = useBoardStore((s) => s.setActiveBoard);
  const addWorkspace = useBoardStore((s) => s.addWorkspace);
  const addBoard = useBoardStore((s) => s.addBoard);

  const deleteWorkspace = useBoardStore((s) => s.deleteWorkspace);

  // Workspace form
  const [showNewWS, setShowNewWS] = useState(false);
  const [newWSTitle, setNewWSTitle] = useState('');
  const [newWSDesc, setNewWSDesc] = useState('');

  // Board form
  const [addingBoardToWS, setAddingBoardToWS] = useState<string | null>(null);
  const [newBoardTitle, setNewBoardTitle] = useState('');



  const handleAddWorkspace = () => {
    if (!newWSTitle.trim()) return;
    addWorkspace(newWSTitle.trim(), newWSDesc.trim() || undefined);
    setNewWSTitle('');
    setNewWSDesc('');
    setShowNewWS(false);
  };

  const handleAddBoard = (wsId: string) => {
    if (!newBoardTitle.trim()) return;
    addBoard(wsId, newBoardTitle.trim());
    setActiveWorkspace(wsId);
    setNewBoardTitle('');
    setAddingBoardToWS(null);
  };


  return (
    <aside className={styles.sidebar}>
      {/* App logo */}
      <div className={styles.logo}>
        <span className={styles.logoIcon}>⚡</span>
        <span className={styles.logoText}>KanbanPro</span>
      </div>

      {/* ─── Tạo Workspace mới — đặt ngay dưới logo ─── */}
      <div className={styles.addWSTopSection}>
        {showNewWS ? (
          <div className={styles.addWSForm}>
            <input
              className={styles.addWSInput}
              value={newWSTitle}
              onChange={(e) => setNewWSTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddWorkspace();
                if (e.key === 'Escape') setShowNewWS(false);
              }}
              placeholder="Tên workspace..."
              autoFocus
            />
            <input
              className={styles.addWSInput}
              value={newWSDesc}
              onChange={(e) => setNewWSDesc(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddWorkspace(); }}
              placeholder="Mô tả (tuỳ chọn)..."
            />
            <div className={styles.addWSActions}>
              <button className={styles.confirmBtn} onClick={handleAddWorkspace}>
                ✓ Tạo Workspace
              </button>
              <button className={styles.cancelSmBtn} onClick={() => setShowNewWS(false)}>✕</button>
            </div>
          </div>
        ) : (
          <button className={styles.addWSBtnTop} onClick={() => setShowNewWS(true)}>
            <span className={styles.addWSBtnIcon}>＋</span>
            Tạo Workspace mới
          </button>
        )}
      </div>

      <div className={styles.dividerLine} />

      {/* ─── Danh sách workspace ─── */}
      <div className={styles.scrollArea}>
        {workspaces.map((ws) => (
          <div key={ws.id} className={styles.workspaceGroup}>
            {/* Workspace header */}
            <div
              className={`${styles.wsHeader} ${activeWorkspaceId === ws.id ? styles.wsHeaderActive : ''}`}
              onClick={() => setActiveWorkspace(ws.id)}
            >
              <span className={styles.wsIcon}>🏢</span>
              <div className={styles.wsInfo}>
                <span className={styles.wsName}>{ws.title}</span>
                {ws.description && <span className={styles.wsDesc}>{ws.description}</span>}
              </div>
              <button
                className={styles.wsDeleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  if (workspaces.length > 1) deleteWorkspace(ws.id);
                }}
                title={workspaces.length === 1 ? 'Không thể xoá workspace cuối' : 'Xoá workspace'}
                disabled={workspaces.length === 1}
              >✕</button>
            </div>

            {/* Boards list — chỉ hiện khi workspace đang active */}
            {activeWorkspaceId === ws.id && (
              <div className={styles.boardList}>
                {ws.boards.map((board) => (
                  <div key={board.id} className={styles.boardEntry}>
                    {/* Board item */}
                    <button
                      className={`${styles.boardItem} ${activeBoardId === board.id ? styles.active : ''}`}
                      onClick={() => { setActiveWorkspace(ws.id); setActiveBoard(board.id); }}
                    >
                      <span className={styles.boardIcon}>📋</span>
                      <span className={styles.boardName}>{board.title}</span>
                      {activeBoardId === board.id && <span className={styles.activeDot} />}
                    </button>


                  </div>
                ))}

                {/* Add board */}
                {addingBoardToWS === ws.id ? (
                  <div className={styles.addBoardForm}>
                    <input
                      className={styles.addBoardInput}
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddBoard(ws.id);
                        if (e.key === 'Escape') setAddingBoardToWS(null);
                      }}
                      placeholder="Tên board..."
                      autoFocus
                    />
                    <div className={styles.addBoardActions}>
                      <button className={styles.confirmBtn} onClick={() => handleAddBoard(ws.id)}>✓ Thêm</button>
                      <button className={styles.cancelSmBtn} onClick={() => setAddingBoardToWS(null)}>✕</button>
                    </div>
                  </div>
                ) : (
                  <button
                    className={styles.addBoardBtn}
                    onClick={() => { setAddingBoardToWS(ws.id); setNewBoardTitle(''); }}
                  >
                    + Thêm board
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
