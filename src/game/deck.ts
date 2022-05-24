import { CardSuit, Face, ICard } from './card';

import { generateRandom } from './random';

export const DECKS_AMOUNT = 6;

function generateSuit(suit: CardSuit): ICard[] {
  const numbers: ICard[] = Array.from({ length: 9 }, (_, i) => ({
    face: null,
    suit,
    value: i + 2,
  }));
  const faces: ICard[] = Object.values(Face).map((face) => ({
    face,
    suit,
    value: null,
  }));
  return numbers.concat(faces);
}

const CARDS: ICard[] = Object.keys(CardSuit).map(generateSuit).flat();

export class Deck {
  cards: ICard[];

  constructor() {
    this.cards = Array.from({ length: DECKS_AMOUNT }, () => [...CARDS]).flat();
    this.shuffle();
  }

  shuffle(): ICard[] {
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

  randomCards(amount: number): ICard[] {
    const exclude = [];
    const cards = [];
    while (amount > 0 && this.cards.length > 0) {
      const num = generateRandom(0, this.cards.length);
      cards.push(this.cards[num]);
      this.cards = [...this.cards.slice(0, num), ...this.cards.slice(num + 1)];
      exclude.push(num);
      amount--;
    }
    return cards;
  }
}
