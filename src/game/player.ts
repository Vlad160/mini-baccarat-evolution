import { action, makeObservable, observable } from 'mobx';

import { Bet } from './bet';

export class User {
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
