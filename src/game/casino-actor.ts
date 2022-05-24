import { action, computed, makeObservable, observable } from 'mobx';

import { Card } from './card';

export enum CasinoPlayerType {
  Banker = 'Banker',
  Player = 'Player',
}

export class CasinoActor {
  cards: Card[] = [];

  constructor(private type: CasinoPlayerType) {
    makeObservable(this, {
      score: computed,
      cards: observable.ref,
      addCard: action,
      resetCards: action,
      acceptCards: action,
      hasNatural: computed,
    });
  }

  get score(): number {
    return this.cards.reduce((acc, card) => acc + card.score, 0) % 10;
  }

  get isBanker() {
    return this.type === CasinoPlayerType.Banker;
  }

  get isPlayer() {
    return this.type === CasinoPlayerType.Player;
  }

  addCard(card: Card): void {
    this.cards = [...this.cards, card];
  }

  resetCards(): void {
    this.cards = [];
  }

  acceptCards(cards: Card[]): void {
    this.cards = this.cards.concat(cards);
  }

  get hasNatural(): boolean {
    return this.score === 8 || this.score === 9;
  }
}
