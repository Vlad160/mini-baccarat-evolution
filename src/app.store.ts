import { GameRoom, User } from '@game';
import { action, computed, makeObservable, observable } from 'mobx';
import { createContext } from 'react';

export class ApplicationStore {
  @observable
  private _user: User = null;
  @computed
  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  @observable
  room: GameRoom;

  constructor() {
    makeObservable(this);
  }

  @action
  createGameRoom(): GameRoom {
    this.room = new GameRoom(this._user);
    return this.room;
  }

  @action
  logout(): void {
    this.room = null;
    this.user = null;
    User.clearUser();
  }
}

export const ApplicationStoreContext = createContext<ApplicationStore>(null);
