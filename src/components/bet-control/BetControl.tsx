import './bet-control.scss';

import { BetWinner } from '../../game/model';
import { GameRoom } from '../../game/game-room';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

export interface IBetControlProps {
  game: GameRoom;
}

export const BetControl: React.FC<IBetControlProps> = observer(({ game }) => {
  const control = game.draftBet;

  const handlePlusClick = useCallback(() => {
    control.increseBet();
  }, [control]);

  const handleMinusClick = useCallback(() => {
    control.decreaseBet();
  }, [control]);

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      control.alterWinner(event.target.value as BetWinner);
    },
    []
  );

  const handleBetClick = useCallback(() => {
    game.acceptBet(control.amount, control.winner);
    control.reset();
  }, [control, game]);

  return (
    <div className="bet-control">
      <div>Money: {game.user.money}</div>
      <div>
        <select onChange={handleSelectChange} value={control.winner}>
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
          <div>To bet: {control.amount}</div>
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
