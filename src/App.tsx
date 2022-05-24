import './app.scss';

import { BaccaratGameRoom } from './game/baccarat-game-room';
import { GameRoom } from './views/game-room/GameRoom';
import { Login } from './components/login/Login';
import { User } from './game/player';
import { useState } from 'react';

function App() {
  const me = new User(crypto.randomUUID(), 'Vlad', 1000);
  const [baccaratGame, setBaccaratGame] = useState(new BaccaratGameRoom(me));

  return (
    <main className="app">
      <GameRoom room={baccaratGame} />
      {/* <Login /> */}
    </main>
  );
}

export default App;
