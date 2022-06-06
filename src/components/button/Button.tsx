import './styles.scss';

import { forwardRef } from 'react';

export interface IButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  kind?: 'default' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ className, children, kind, ...rest }, ref) => {
    const classes = ['btn', kind === 'icon' && 'btn--icon', className]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    );
  }
);
