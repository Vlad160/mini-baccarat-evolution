import { Face, ICard } from './card';
import { action, computed, makeObservable, observable } from 'mobx';

export enum CasinoPlayerType {
  Banker = 'Banker',
  Player = 'Player',
}

export class CasinoActor {
  cards: ICard[] = [];

  constructor(private type: CasinoPlayerType) {
    makeObservable(this, {
      score: computed,
      cards: observable.shallow,
      addCard: action,
      resetCards: action,
      acceptCards: action,
      hasNatural: computed
    });
  }

  get score(): number {
    return (
      this.cards.reduce((acc, card) => {
        if (card.value !== null && card.value !== 10) {
          return card.value + acc;
        }
        if (card.face === Face.Ace) {
          return acc + 1;
        }
        return acc;
      }, 0) % 10
    );
  }

  get isBanker() {
    return this.type === CasinoPlayerType.Banker;
  }

  get isPlayer() {
    return this.type === CasinoPlayerType.Player;
  }

  addCard(card: ICard): void {
    this.cards = [...this.cards, card];
  }

  resetCards(): void {
    this.cards = [];
  }

  acceptCards(cards: ICard[]): void {
    this.cards = this.cards.concat(cards);
  }

  get hasNatural(): boolean {
    return this.score === 8 || this.score === 9;
  }
}
