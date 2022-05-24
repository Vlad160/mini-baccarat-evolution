import { action, makeObservable, observable } from 'mobx';

import { BetWinner } from './model';

export class Bet {
  amount: number = 0;
  winner: BetWinner = BetWinner.Player;

  constructor() {
    makeObservable(this, {
      amount: observable,
      winner: observable,
      alterAmount: action,
      alterWinner: action,
      adjustBet: action,
      reset: action,
    });
  }

  alterAmount(delta: number): void {
    this.amount += delta;
  }

  alterWinner(winner: BetWinner): void {
    this.winner = winner;
  }
  adjustBet(value: number, winner: BetWinner): void {
    this.amount += value;
    this.winner = winner;
  }

  reset(): void {
    this.amount = 0;
    this.winner = BetWinner.Player;
  }
}
export class Player {
  bet = new Bet();

  constructor(
    public readonly id: string,
    private _name: string,
    public money: number
  ) {
    makeObservable(this, {
      money: observable,
      alterMoney: action,
    });
  }

  get name(): string {
    return this._name;
  }

  alterMoney(money: number): void {
    this.money += money;
  }
}
