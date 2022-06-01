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
    return (
      <button
        ref={ref}
        className={`btn${kind === 'icon' ? ' btn--icon' : ''} ${
          className || ''
        }`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
