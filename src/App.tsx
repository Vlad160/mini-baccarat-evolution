import './app.scss';

import { BaccaratGameRoom } from './game/baccarat-game-room';
import { GameRoom } from './views/game-room/GameRoom';
import { Header } from '@components';
import { User } from './game/player';
import { useState } from 'react';

function App() {
  const me = new User(crypto.randomUUID(), 'Vlad', 1000);
  const [baccaratGame, setBaccaratGame] = useState(new BaccaratGameRoom(me));

  return (
    <div className="app">
      <Header></Header>
      <main className="app__wrapper">
        <GameRoom room={baccaratGame} />
        {/* <Login /> */}
      </main>
    </div>
  );
}

export default App;
