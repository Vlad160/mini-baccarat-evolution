import { Card, CardSuit, Face } from './card';

describe('card.ts', () => {
  it.each([
    {
      card: {
        value: 1,
        face: null,
        suit: CardSuit.Club,
      },
      expected: 1,
    },
    {
      card: {
        value: 9,
        face: null,
        suit: CardSuit.Club,
      },
      expected: 9,
    },
    {
      card: {
        value: 10,
        face: null,
        suit: CardSuit.Club,
      },
      expected: 0,
    },
    {
      card: {
        value: null,
        face: Face.Ace,
        suit: CardSuit.Club,
      },
      expected: 1,
    },
    {
      card: {
        value: null,
        face: Face.Jack,
        suit: CardSuit.Club,
      },
      expected: 0,
    },
    {
      card: {
        value: null,
        face: Face.King,
        suit: CardSuit.Club,
      },
      expected: 0,
    },
    {
      card: {
        value: null,
        face: Face.Queen,
        suit: CardSuit.Club,
      },
      expected: 0,
    },
  ])(`should return score $exected for card $card`, ({ card, expected }) => {
    const playCard = new Card(card);
    expect(playCard.score).toEqual(expected);
  });
});
