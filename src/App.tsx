import './app.scss';

import { Header, Login } from '@components';
import { DEFAULT_MONEY_AMOUNT, User } from '@game';
import { ApplicationStoreContext } from './app.store';
import { observer } from 'mobx-react-lite';
import { useCallback, useContext, useEffect } from 'react';
import { GameRoomCanvas } from './views/game-room-canvas/GameRoomCanvas';

const App = observer(() => {
  const store = useContext(ApplicationStoreContext);

  useEffect(() => {
    if (store.user) {
      return;
    }
    const user = User.restoreUser();
    if (!user) {
      return;
    }
    store.user = user;
    store.createGameRoom();
  }, [store]);

  const handleLogin = useCallback(
    (username: string) => {
      store.user = new User(
        crypto.randomUUID(),
        username,
        DEFAULT_MONEY_AMOUNT
      );
      User.storeUser(store.user);
      store.createGameRoom();
    },
    [store]
  );

  return (
    <div className="app">
      <Header></Header>
      <main className="app__wrapper">
        {store.room ? (
          <GameRoomCanvas room={store.room} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
});

export default App;
