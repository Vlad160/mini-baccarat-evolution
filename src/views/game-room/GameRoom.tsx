import './game-room.scss';

import { useCallback, useState } from 'react';

import { BaccaratGameRoom } from '../../game/baccarat-game-room';
import { BetControl } from '../../components/bet-control/BetControl';
import { BetWinner } from '../../game/model';
import { Card } from '../../components/card/card';
import { observer } from 'mobx-react-lite';

export interface IGameRoomProps {
  room: BaccaratGameRoom;
}

const formatTimer = (time: number) => {
  return Math.round(time / 1000);
};

export const GameRoom: React.FC<IGameRoomProps> = observer(({ room }) => {
  const handleStartGameClick = useCallback(async () => {
    await room.startGame();
  }, [room]);

  return (
    <div className="game-room">
      <h1>Game status {room.status}</h1>
      <div>Accepting bets: {formatTimer(room.bettingTimer.timeLeft)}s</div>

      <div className="game-room__main">
        <div className="game-room__cards">
          <div>
            <div className="game-room__card">
              Banker cards:{' '}
              {room.banker.cards.map((card, i) => (
                <Card card={card} key={i} />
              ))}
            </div>
            <div>Score: {room.banker.score}</div>
          </div>
          <div>
            <div className="game-room__card">
              Player cards:{' '}
              {room.player.cards.map((card, i) => (
                <Card card={card} key={i} />
              ))}
            </div>
            <div>Score: {room.player.score}</div>
          </div>
        </div>
        <div className="game-room__history">
          <p>History:</p>
          <ul className="game-room__history-list">
            {room.history.map((result, i) => (
              <li key={i}>{result}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <BetControl game={room} />
      </div>

      <div>Winner: {room.winner}</div>
      <button onClick={handleStartGameClick}>Start game</button>
    </div>
  );
});
