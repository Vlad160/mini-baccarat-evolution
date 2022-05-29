import { action, computed, makeObservable, observable } from 'mobx';
import { Card } from './card';

export enum CasinoPlayerType {
  Banker = 'Banker',
  Player = 'Player',
}

export class CasinoActor {
  @observable.ref
  cards: Card[] = [];

  constructor(private type: CasinoPlayerType) {
    makeObservable(this);
  }

  @computed
  get score(): number {
    return this.cards.reduce((acc, card) => acc + card.score, 0) % 10;
  }

  @computed
  get hasNatural(): boolean {
    return this.score === 8 || this.score === 9;
  }

  get isBanker() {
    return this.type === CasinoPlayerType.Banker;
  }

  get isPlayer() {
    return this.type === CasinoPlayerType.Player;
  }

  @action
  resetCards(): void {
    this.cards = [];
  }

  @action
  acceptCards(cards: Card[]): void {
    this.cards = this.cards.concat(cards);
  }
}
