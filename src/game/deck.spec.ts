import { Deck } from './deck';

describe('deck.ts', () => {
  let deck: Deck;
  const deckSize = 6;

  beforeEach(() => {
    deck = new Deck(deckSize);
  });

  it('should create deck', () => {
    expect(deck.cards.length).toEqual(deckSize * 52);
  });

  it('should shuffle deck', () => {
    const cards = [...deck.cards];
    deck.shuffle();
    expect(deck.cards).not.toEqual(cards);
  });

  it('should return cards', () => {
    const cards = deck.take(3);
    expect(cards.length).toEqual(3);
    expect(deck.cards.length).toEqual(deckSize * 52 - 3);
  });
});
