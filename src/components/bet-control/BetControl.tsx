import './bet-control.scss';

import { useCallback, useState } from 'react';

import { BaccaratGameRoom } from '../../game/baccarat-game-room';
import { BetControl as BetControlStore } from '../../game/bet-control';
import { BetWinner } from '../../game/model';
import { observer } from 'mobx-react-lite';

export interface IBetControlProps {
  game: BaccaratGameRoom;
}

export const BetControl: React.FC<IBetControlProps> = observer(({ game }) => {
  const [control] = useState(() => new BetControlStore(game.user, 10));

  const handlePlusClick = useCallback(() => {
    control.increseBet();
  }, [control]);

  const handleMinusClick = useCallback(() => {
    control.decreaseBet();
  }, [control]);

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      control.bet.alterWinner(event.target.value as BetWinner);
    },
    []
  );

  const handleBetClick = useCallback(() => {
    game.acceptBet(control.bet.amount, control.bet.winner);
    control.reset();
  }, [control, game]);

  return (
    <div className="bet-control">
      <div>Money: {game.user.money}</div>
      <div>
        <select onChange={handleSelectChange} value={control.bet.winner}>
          <option value={BetWinner.Player}>Player</option>
          <option value={BetWinner.Banker}>Banker</option>
          <option value={BetWinner.Tie}>Tie</option>
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          Total bet: {game.user.bet.amount} Outcome: {game.user.bet.winner}
        </div>
        <div className="bet-control__amount">
          <div>To bet: {control.bet.amount}</div>
          <div>
            <button onClick={handleMinusClick}>-</button>
            <button onClick={handlePlusClick}>+</button>
          </div>
        </div>
        <button disabled={!game.isBettingOpened} onClick={handleBetClick}>
          Bet!
        </button>
      </div>
    </div>
  );
});
