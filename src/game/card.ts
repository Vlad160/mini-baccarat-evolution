export interface ICard {
  value: number | null;
  face: Face | null;
  suit: CardSuit;
}

export enum CardSuit {
  // ♥
  Heart = 'Heart',
  // ♦
  Diamond = 'Diamond',
  // ♣
  Club = 'Club',
  // ♠
  Spade = 'Spade',
}

export enum Face {
  Ace = 'Ace',
  Jack = 'Jack',
  Queen = 'Queen',
  King = 'King',
}

export const SuitToSymbol: Record<CardSuit, string> = {
  [CardSuit.Heart]: '♥',
  [CardSuit.Diamond]: '♦',
  [CardSuit.Club]: '♣',
  [CardSuit.Spade]: '♠',
};

export class Card implements ICard {
  id = crypto.randomUUID();
  value: number;
  face: Face;
  suit: CardSuit;
  constructor({ value, face, suit }: ICard) {
    this.value = value;
    this.face = face;
    this.suit = suit;
  }

  get score(): number {
    if (this.value !== null && this.value !== 10) {
      return this.value;
    }
    if (this.face === Face.Ace) {
      return 1;
    }
    return 0;
  }
}
