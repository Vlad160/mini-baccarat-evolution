import { action, computed, makeObservable, observable } from 'mobx';
import { BetWinner } from './model';

export const DEFAULT_WINNER = BetWinner.Player;

export class Bet {
  @observable
  private _amount = 0;

  @computed
  get amount(): number {
    return this._amount;
  }

  set amount(value: number) {
    this._amount = value;
  }

  @observable
  private _winner: BetWinner = DEFAULT_WINNER;

  @computed
  get winner(): BetWinner {
    return this._winner;
  }

  set winner(value: BetWinner) {
    this._winner = value;
  }

  constructor() {
    makeObservable(this);
  }

  @action
  reset(): void {
    this.amount = 0;
    this.winner = BetWinner.Player;
  }
}
