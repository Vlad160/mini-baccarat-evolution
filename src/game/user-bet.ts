import { Bet } from './bet';
import { User } from './user';

export class UserBet extends Bet {
  constructor(private user: User, public betSize: number) {
    super();
  }

  increseBet(): void {
    if (this.user.money - this.betSize < 0) {
      return;
    }
    this.amount = this.amount + this.betSize;
    this.user.money -= this.betSize;
  }

  decreaseBet(): void {
    const newAmount = this.amount - this.betSize;
    if (newAmount < 0) {
      this.amount =
        this.user.bet.amount < Math.abs(newAmount) ? this.amount : newAmount;
    } else {
      this.amount = newAmount;
    }
  }

  reset(): void {
    this.amount = 0;
    this.winner = this.user.bet.winner;
  }
}
