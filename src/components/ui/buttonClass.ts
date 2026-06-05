import styles from './Button.module.css';

export type ButtonVariant = 'accent' | 'ghost';

/** Compose button classes for use on <Link>, <a>, or <button> directly
 *  (keeps routing/anchor semantics simple without a polymorphic wrapper). */
export function buttonClass(
  variant: ButtonVariant = 'accent',
  opts?: { large?: boolean; className?: string },
): string {
  return [styles.btn, styles[variant], opts?.large ? styles.lg : '', opts?.className ?? '']
    .filter(Boolean)
    .join(' ');
}
