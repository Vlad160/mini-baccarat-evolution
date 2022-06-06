import { computed, makeObservable, observable } from 'mobx';
import { Bet } from './bet';

const USER_KEY = 'user';
export class User {
  bet: Bet;

  static restoreUser(): User {
    const value = localStorage.getItem(USER_KEY);
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
    return new User(
      userObject.id,
      userObject.name,
      userObject.money,
      userObject.soundDisabled
    );
  }

  static storeUser(user: User): void {
    localStorage.setItem(USER_KEY, user.toJSON());
  }

  static clearUser(): void {
    localStorage.removeItem(USER_KEY);
  }

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

  @observable
  private _soundDisabled = false;

  @computed
  public get soundDisabled() {
    return this._soundDisabled;
  }

  public set soundDisabled(value) {
    this._soundDisabled = value;
    User.storeUser(this);
  }

  constructor(
    public readonly id: string,
    private _name: string,
    money: number,
    soundDisabled = false
  ) {
    makeObservable(this);
    this._money = money;
    this.soundDisabled = soundDisabled;
    this.bet = new Bet();
  }

  get name(): string {
    return this._name;
  }

  toJSON(): string {
    return JSON.stringify({
      money: this.money,
      name: this.name,
      id: this.id,
      soundDisabled: this.soundDisabled,
    });
  }
}
