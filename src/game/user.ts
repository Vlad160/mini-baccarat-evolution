import { computed, makeObservable, observable } from 'mobx';
import { Bet } from './bet';
export class User {
  static restoreUser(): User {
    const value = localStorage.getItem('user');
    if (!value) {
      return null;
    }
    let userObject: Record<string, any> = null;
    try {
      userObject = JSON.parse(value);
    } catch {
      userObject = null;
    }
    if (!userObject) {
      return null;
    }
    return new User(userObject.id, userObject.name, userObject.money);
  }

  static storeUser(user: User): void {
    localStorage.setItem('user', user.toJSON());
  }

  static clearUser(): void {
    localStorage.removeItem('user');
  }

  bet = new Bet();
  @observable
  private _money: number;
  @computed
  get money(): number {
    return this._money;
  }

  set money(value: number) {
    this._money = value;
    User.storeUser(this);
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

  toJSON(): string {
    return JSON.stringify({ money: this.money, name: this.name, id: this.id });
  }
}
