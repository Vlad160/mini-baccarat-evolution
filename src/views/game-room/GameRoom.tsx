import './game-room.scss';

import { BetControl, Card } from '@components';

import { BaccaratGameRoom } from '../../game/baccarat-game-room';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

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

  const handleStopGameClick = useCallback(async () => {
    await room.stopGame();
  }, [room]);

  return (
    <div className="game-room">
      <div className="game-room__header">
        <h1>Game status {room.status}</h1>
        {room.isGameStopping && <h3>Game is being stopped...</h3>}
        <div>Accepting bets: {formatTimer(room.bettingTimer.timeLeft)}s</div>
      </div>

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

      <div className="game-room__actions">
        <div>Winner: {room.winner}</div>
        <div>
          <button onClick={handleStartGameClick}>Start game</button>
          <button onClick={handleStopGameClick}>Stop game</button>
        </div>
      </div>
    </div>
  );
});
