import './App.css';

import { BaccaratGameRoom } from './game/baccarat-game-room';
import { GameRoom } from './views/game-room/GameRoom';
import { Player } from './game/player';
import { useState } from 'react';

function App() {
  const me = new Player(crypto.randomUUID(), 'Vlad', 1000);
  const [baccaratGame, setBaccaratGame] = useState(new BaccaratGameRoom(me));

  return (
    <div className="App">
      <GameRoom room={baccaratGame} />
    </div>
  );
}

export default App;
