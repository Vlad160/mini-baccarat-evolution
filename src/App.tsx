import './app.scss';

import { Header, Login } from '@components';
import { GameRoom, User } from '@game';
import { useCallback, useState } from 'react';
import { GameRoomPixi } from 'views/game-room-pixi/GameRoomPixi';

const MONEY = 1000;

function App() {
  const [baccaratGame, setGameRoom] = useState<GameRoom>(null);

  const handleLogin = useCallback((username: string) => {
    const user = new User(crypto.randomUUID(), username, MONEY);
    setGameRoom(new GameRoom(user));
  }, []);

  return (
    <div className="app">
      <Header></Header>
      <main className="app__wrapper">
        {baccaratGame ? (
          <GameRoomPixi room={baccaratGame} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
}

export default App;
