import './bet-control.scss';

import { useCallback, useState } from 'react';

import { BaccaratGameRoom } from '../../game/baccarat-game-room';
import { BetWinner } from '../../game/model';
import { observer } from 'mobx-react-lite';

export interface IBetControlProps {
  game: BaccaratGameRoom;
}

export const BetControl: React.FC<IBetControlProps> = observer(({ game }) => {
  const [amount, setAmount] = useState(0);
  const [winner, setWinner] = useState<BetWinner>(game.me.bet.winner);

  const handlePlusClick = useCallback(() => {
    setAmount((amount) => {
      const newAmount = amount + 10;
      return game.me.money > newAmount ? newAmount : amount;
    });
  }, [game]);

  const handleMinusClick = useCallback(() => {
    setAmount(amount => {
      const newAmount = amount - 10;
      if (newAmount < 0) {
        return game.me.bet.amount < Math.abs(newAmount) ? amount : newAmount;
      }
      return newAmount;
    });
  }, []);

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setWinner(event.target.value as BetWinner);
    },
    []
  );

  const handleBetClick = useCallback(() => {
    game.acceptBet(amount, winner);
    setAmount(0);
    setWinner(game.me.bet.winner);
  }, [amount, winner, game]);

  return (
    <div className="bet-control">
      <div>Money: {game.me.money}</div>
      <div>
        <select onChange={handleSelectChange} value={winner}>
          <option value={BetWinner.Player}>Player</option>
          <option value={BetWinner.Banker}>Banker</option>
          <option value={BetWinner.Tie}>Tie</option>
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          Total bet: {game.me.bet.amount} Outcome: {game.me.bet.winner}
        </div>
        <div className="bet-control__amount">
          <div>To bet: {amount}</div>
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
