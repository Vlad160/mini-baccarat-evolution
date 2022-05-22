export interface ICard {
  value: number | null;
  face: Face | null;
  suit: CardSuit;
}

export enum CardSuit {
  // ♥
  Heart = 'Hearts',
  // ♦
  Diamond = 'Diamonds',
  // ♣
  Clover = 'Clover',
  // ♠
  Spade = 'Spade',
}

export enum Face {
  Ace = 'Ace',
  Jack = 'Jack',
  Queen = 'Queen',
  King = 'King',
}
