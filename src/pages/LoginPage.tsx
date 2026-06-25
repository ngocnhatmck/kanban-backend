import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isRegistering) {
        if (!name.trim()) {
          setError('Vui lòng nhập họ và tên');
          setIsLoading(false);
          return;
        }
        await register({ name: name.trim(), email: email.trim(), password });
      } else {
        await login({ email: email.trim(), password });
      }
      navigate('/');
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 
        err?.message || 
        (isRegistering ? 'Đăng ký thất bại' : 'Đăng nhập thất bại')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h1>⚡ KanbanPro</h1>
          <p>{isRegistering ? 'Tạo tài khoản mới' : 'Quản lý công việc hiệu quả'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className={styles.formGroup}>
              <label>Họ và tên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                disabled={isLoading}
                required
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading 
              ? (isRegistering ? 'Đang đăng ký...' : 'Đang đăng nhập...') 
              : (isRegistering ? 'Đăng Ký' : 'Đăng Nhập')
            }
          </button>
        </form>

        <div className={styles.toggleText}>
          {isRegistering ? (
            <>
              Đã có tài khoản?{' '}
              <span onClick={() => { setIsRegistering(false); setError(''); }}>
                Đăng nhập ngay
              </span>
            </>
          ) : (
            <>
              Chưa có tài khoản?{' '}
              <span onClick={() => { setIsRegistering(true); setError(''); }}>
                Đăng ký tài khoản
              </span>
            </>
          )}
        </div>

        {!isRegistering && (
          <div className={styles.demo} style={{ marginTop: '20px' }}>
            <p>💡 Tài khoản Demo:</p>
            <p>Email: demo@example.com</p>
            <p>Mật khẩu: 123456</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
