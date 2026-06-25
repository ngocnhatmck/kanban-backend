import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { LoginPage } from './pages/LoginPage';
import { useAuth } from './hooks/useAuth';
import { useBoardStore } from './hooks/useBoardStore';
import styles from './App.module.css';

function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const fetchWorkspaces = useBoardStore((s) => s.fetchWorkspaces);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkspaces();
    }
  }, [isAuthenticated, fetchWorkspaces]);

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>⏳ Đang tải...</div>;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Kanban Board Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div className={styles.layout}>
                <Sidebar />
                <div className={styles.main}>
                  <Header />
                  <div className={styles.content}>
                    <Board />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
