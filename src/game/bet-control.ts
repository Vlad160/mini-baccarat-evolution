import { Bet } from './bet';
import { User } from './user';

export class BetControl {
  constructor(private user: User, public betSize: number) {}

  bet = new Bet();

  increseBet(): void {
    const newAmount = this.bet.amount + this.betSize;
    this.bet.amount = this.user.money > newAmount ? newAmount : this.bet.amount;
  }

  decreaseBet(): void {
    const newAmount = this.bet.amount - 10;
    if (newAmount < 0) {
      this.bet.amount =
        this.user.bet.amount < Math.abs(newAmount)
          ? this.bet.amount
          : newAmount;
    } else {
      this.bet.amount = newAmount;
    }
  }

  reset(): void {
    this.bet.amount = 0;
    this.bet.alterWinner(this.user.bet.winner);
  }
}
