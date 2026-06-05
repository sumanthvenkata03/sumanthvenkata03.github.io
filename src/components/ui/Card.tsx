import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
  soft?: boolean;
  children: ReactNode;
}

/** Base card. `soft` layers the navy→teal gradient (legacy .card-soft). */
export default function Card({ soft, children, className, ...rest }: Props) {
  return (
    <div className={`${styles.card} ${soft ? styles.soft : ''} ${className ?? ''}`} {...rest}>
      {children}
    </div>
  );
}
