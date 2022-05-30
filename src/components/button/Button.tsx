import './styles.scss';

import { forwardRef } from 'react';

export const Button = forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>(({ className, children, ...rest }, ref) => {
  return (
    <button ref={ref} className={`btn ${className || ''}`} {...rest}>
      {children}
    </button>
  );
});
