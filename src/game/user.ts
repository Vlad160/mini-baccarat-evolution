import { computed, makeObservable, observable } from 'mobx';
import { Bet } from './bet';
export class User {
  bet = new Bet();
  @observable
  private _money: number;
  @computed
  get money(): number {
    return this._money;
  }

  set money(value: number) {
    this._money = value;
  }

  constructor(
    public readonly id: string,
    private _name: string,
    money: number
  ) {
    makeObservable(this);
    this._money = money;
  }

  get name(): string {
    return this._name;
  }
}
