import { action, computed, makeObservable, observable } from 'mobx';

import { BetWinner } from './model';

export class Bet {
  @observable
  private _amount: number = 0;
  @computed
  public get amount(): number {
    return this._amount;
  }
  public set amount(value: number) {
    this._amount = value;
  }
  @observable
  private _winner: BetWinner = BetWinner.Player;
  @computed
  public get winner(): BetWinner {
    return this._winner;
  }
  public set winner(value: BetWinner) {
    this._winner = value;
  }

  constructor() {
    makeObservable(this);
  }

  @action
  alterAmount(delta: number): void {
    this.amount += delta;
  }
  @action
  alterWinner(winner: BetWinner): void {
    this.winner = winner;
  }
  @action
  adjustBet(value: number, winner: BetWinner): void {
    this.amount += value;
    this.winner = winner;
  }
  @action
  reset(): void {
    this.amount = 0;
    this.winner = BetWinner.Player;
  }
}
