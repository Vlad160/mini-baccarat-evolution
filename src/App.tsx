import './app.scss';

import { GameRoom } from './game/game-room';
import { GameRoomPixi } from 'views/game-room-pixi/GameRoomPixi';
// import { GameRoom } from './views/game-room/GameRoom';
import { Header } from '@components';
import { User } from './game/user';
import { useState } from 'react';

function App() {
  const me = new User(crypto.randomUUID(), 'Vlad', 1000);
  const [baccaratGame, setBaccaratGame] = useState(new GameRoom(me));

  return (
    <div className="app">
      <Header></Header>
      <main className="app__wrapper">
        {/* <GameRoom room={baccaratGame} /> */}
        {/* <Login /> */}
        <GameRoomPixi room={baccaratGame} />
      </main>
    </div>
  );
}

export default App;
