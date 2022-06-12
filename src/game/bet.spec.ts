import { Bet, DEFAULT_WINNER } from './bet';
import { BetWinner } from './model';

describe('bet.ts', () => {
  let bet: Bet;

  beforeEach(() => {
    bet = new Bet();
  });

  it('should reset amount and winner', () => {
    bet.amount = 10;
    bet.winner = BetWinner.Banker;
    bet.reset();
    expect(bet.amount).toEqual(0);
    expect(bet.winner).toEqual(DEFAULT_WINNER);
  });
});
