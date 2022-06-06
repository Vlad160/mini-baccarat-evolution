import { Card, CardSuit } from './card';
import { generateSuit } from './generate-suit';

export const DEFAULT_MONEY_AMOUNT = 1000;
export const CARDS: Card[] = Object.keys(CardSuit).map(generateSuit).flat();
