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

export const SuitToSymbol: Record<CardSuit, string> = {
  [CardSuit.Heart]: '♥',
  [CardSuit.Diamond]: '♦',
  [CardSuit.Clover]: '♣',
  [CardSuit.Spade]: '♠',
}

export class Card {
  
}