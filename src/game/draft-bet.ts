import { Bet } from './bet';
import { User } from './user';

export class DraftBet extends Bet {
  constructor(private user: User, public betSize: number) {
    super();
  }

  increseBet(): void {
    const newAmount = this.amount + this.betSize;
    this.amount = this.user.money > newAmount ? newAmount : this.amount;
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
    this.alterWinner(this.user.bet.winner);
  }
}