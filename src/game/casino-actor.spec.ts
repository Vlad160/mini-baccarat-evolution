import { Card, CardSuit, Face } from './card';
import { CasinoActor, CasinoPlayerType } from './casino-actor';
describe('casino-actor.ts', () => {
  let actor: CasinoActor;

  beforeEach(() => {
    actor = new CasinoActor(CasinoPlayerType.Player);
  });

  it('should accept card', () => {
    expect(actor.cards).toEqual([]);
    const card = new Card({ value: 1, face: null, suit: CardSuit.Club });
    actor.acceptCards([card]);
    expect(actor.cards).toEqual([card]);
  });

  it('should reset cards', () => {
    const card = new Card({ value: 1, face: null, suit: CardSuit.Club });
    actor.cards = [card];
    expect(actor.cards).toEqual([card]);
    actor.resetCards();
    expect(actor.cards).toEqual([]);
  });

  it.each([
    {
      cards: [
        new Card({ value: 1, face: null, suit: CardSuit.Club }),
        new Card({ value: 8, face: null, suit: CardSuit.Club }),
      ],
      expected: 9,
    },
    {
      cards: [
        new Card({ value: 2, face: null, suit: CardSuit.Club }),
        new Card({ value: 8, face: null, suit: CardSuit.Club }),
      ],
      expected: 0,
    },
    {
      cards: [
        new Card({ value: 2, face: null, suit: CardSuit.Club }),
        new Card({ value: 8, face: null, suit: CardSuit.Club }),
        new Card({ value: null, face: Face.King, suit: CardSuit.Club }),
      ],
      expected: 0,
    },
    {
      cards: [
        new Card({ value: 2, face: null, suit: CardSuit.Club }),
        new Card({ value: 8, face: null, suit: CardSuit.Club }),
        new Card({ value: null, face: Face.Ace, suit: CardSuit.Club }),
      ],
      expected: 1,
    },
  ])(
    `should calculate score for $cards to be $expected`,
    ({ cards, expected }) => {
      actor.cards = cards;
      expect(actor.score).toEqual(expected);
    }
  );
});
