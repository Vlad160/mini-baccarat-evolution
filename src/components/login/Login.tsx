import { FormEvent, useCallback, useRef } from 'react';
import { Button } from '../button/Button';
import './styles.scss';

export interface ILoginProps {
  onLogin: (username: string) => void;
}

export const Login: React.FC<ILoginProps> = ({ onLogin }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = inputRef.current.value.trim();
    if (!value) {
      return;
    }
    onLogin(value);
  }, []);

  return (
    <form className="login" onSubmit={handleSubmit}>
      <label className="login__item">
        <span className="login__label">Name</span>
        <input
          ref={inputRef}
          className="login__input"
          type="text"
          placeholder="Enter your name..."
        />
      </label>
      <Button className="login__btn" type="submit">
        Login
      </Button>
    </form>
  );
};
