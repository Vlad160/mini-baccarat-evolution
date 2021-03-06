import { UserActions } from '@components/user-actions/UserActions';
import './styles.scss';

export const Header = () => {
  return (
    <header className="header">
      <h1>Mini Baccarat</h1>
      <UserActions />
    </header>
  );
};
