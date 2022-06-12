import { UserBet } from './user-bet';
import { User } from './user';
import { BetWinner } from './model';

describe('user-bet.ts', () => {
  let userBet: UserBet;
  let user: User;
  const betSize = 10;
  const userMoney = 100;
  const maxBet = 20;

  beforeEach(() => {
    user = new User('1', 'test', userMoney);
    userBet = new UserBet(user, betSize, maxBet);
  });

  it('should increase bet by betSize', () => {
    const prevAmount = userBet.amount;
    userBet.increseBet();
    expect(userBet.amount).toEqual(prevAmount + betSize);
  });

  it('should decrease user money', () => {
    userBet.increseBet();
    expect(user.money).toEqual(userMoney - betSize);
  });

  it('should not increase bet if user money is less than betSize', () => {
    user.money = 0;
    userBet.increseBet();
    expect(userBet.amount).toEqual(0);
    expect(user.money).toEqual(0);
  });

  it('should not increase bet if amount is more than maxBet', () => {
    userBet.amount = maxBet;
    userBet.increseBet();
    expect(userBet.amount).toEqual(maxBet);
  });

  it('should decrease bet by betSize', () => {
    userBet.amount = 20;
    const prevAmount = userBet.amount;
    userBet.decreaseBet();
    expect(userBet.amount).toEqual(prevAmount - betSize);
  });

  it('should not decrease bet if amount is less than 0', () => {
    const prevMoney = user.money;
    userBet.amount = 0;
    userBet.decreaseBet();
    expect(userBet.amount).toEqual(0);
    expect(user.money).toEqual(prevMoney);
  });
});
