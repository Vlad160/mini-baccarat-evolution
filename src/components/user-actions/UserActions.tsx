import './styles.scss';

import { Button } from '@components/button/Button';
import { ApplicationStoreContext } from 'app.store';
import { observer } from 'mobx-react-lite';
import { useCallback, useContext } from 'react';
import { FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';

export const UserActions = observer(() => {
  const store = useContext(ApplicationStoreContext);
  const handleLogOut = useCallback(() => {
    store.logout();
  }, [store]);

  const handleResore = useCallback(() => {
    store.user.money = 1000;
  }, [store]);

  if (!store || !store.user) {
    return;
  }

  return (
    <div className="user-actions">
      <span>Hello {store.user.name}!</span>
      <Button kind="icon" onClick={handleResore} title="Restore money">
        <FaMoneyBillWave className="icon" />
      </Button>
      <Button kind="icon" onClick={handleLogOut} title="Log out">
        <FaSignOutAlt className="icon" />
      </Button>
    </div>
  );
});
