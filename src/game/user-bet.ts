import { Bet } from './bet';
import { User } from './user';

export class UserBet extends Bet {
  constructor(
    private user: User,
    public betSize: number,
    public readonly maxBet: number
  ) {
    super();
  }

  increseBet(): void {
    if (this.user.money - this.betSize < 0) {
      return;
    }
    const newAmount = this.amount + this.betSize;
    if (newAmount > this.maxBet) {
      return;
    }
    this.amount = newAmount;
    this.user.money -= this.betSize;
  }

  decreaseBet(): void {
    const newAmount = this.amount - this.betSize;
    if (newAmount < 0) {
      this.amount = this.amount < Math.abs(newAmount) ? this.amount : newAmount;
    } else {
      this.amount = newAmount;
    }
  }
}
