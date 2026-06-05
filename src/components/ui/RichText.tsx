import { createElement, type ElementType } from 'react';

/**
 * Renders a trusted static HTML string (copy that contains inline <b> emphasis,
 * ported verbatim from the legacy site). Content is author-controlled constant
 * data from src/data — never user input — so dangerouslySetInnerHTML is safe.
 */
export default function RichText({
  html,
  as = 'span',
  className,
}: {
  html: string;
  as?: ElementType;
  className?: string;
}) {
  return createElement(as, { className, dangerouslySetInnerHTML: { __html: html } });
}
