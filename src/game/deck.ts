import { Card, CardSuit } from './card';
import { generateSuit } from './generate-suit';

export const DECKS_AMOUNT = 6;
export const CARDS: Card[] = Object.keys(CardSuit).map(generateSuit).flat();

export class Deck {
  cards: Card[];

  constructor() {
    this.resetCards();
  }

  resetCards(): void {
    this.cards = Array.from({ length: DECKS_AMOUNT }, () => [...CARDS]).flat();
    this.shuffle();
  }

  shuffle(): Card[] {
    const cards = [...this.cards];
    let currentIndex = cards.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [cards[currentIndex], cards[randomIndex]] = [
        cards[randomIndex],
        cards[currentIndex],
      ];
    }

    return cards;
  }

  take(amount: number): Card[] {
    const [take, leave] = [
      this.cards.slice(0, amount),
      this.cards.slice(amount + 1),
    ];
    this.cards = leave;
    return take;
  }
}
