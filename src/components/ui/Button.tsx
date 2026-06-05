import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { buttonClass, type ButtonVariant } from './buttonClass';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  large?: boolean;
  children: ReactNode;
}

/** Native <button> (e.g. form submit). For links use buttonClass() on Link/a. */
export default function Button({ variant = 'accent', large, className, children, ...rest }: Props) {
  return (
    <button className={buttonClass(variant, { large, className })} {...rest}>
      {children}
    </button>
  );
}
