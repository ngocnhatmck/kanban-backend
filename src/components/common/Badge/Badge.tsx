import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'priority-high' | 'priority-medium' | 'priority-low' | 'label';

interface BadgeProps {
  children: ReactNode;
  variant: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
};
