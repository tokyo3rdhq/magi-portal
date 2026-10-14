import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/classnames';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export interface GridProps extends HTMLAttributes<HTMLElement> {
  /** Number of columns per breakpoint */
  cols: Partial<Record<Breakpoint, number>>;
  /** Gap token (Tailwind gap number) */
  gap?: number | string;
  /** Override rendered element */
  as?: ElementType;
  children?: ReactNode;
}

export function Grid({ cols, gap = 4, as, className, children, ...rest }: GridProps) {
  const Component = (as ?? 'div') as ElementType;
  const classNames = ['grid'];
  Object.entries(cols).forEach(([bp, count]) => {
    if (count) {
      const prefix = bp as Breakpoint;
      classNames.push(`${prefix}:grid-cols-${count}`);
    }
  });
  classNames.push(`gap-${gap}` as any);
  return (
    <Component className={cx(...classNames, className)} {...rest}>
      {children}
    </Component>
  );
}
