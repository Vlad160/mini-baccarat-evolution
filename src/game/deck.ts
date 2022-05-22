import { CardSuit, Face, ICard } from './card';

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
    this.shuffleCards();
  }

  shuffleCards(): ICard[] {
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
}
