import { CardSuit } from './card';
import { generateSuit } from './generate-suit';

describe('generate-suit.ts', () => {
  it('should generate suit', () => {
    const onlyClubs = generateSuit(CardSuit.Club);
    const isClubsOnly = onlyClubs.every(({ suit }) => suit === CardSuit.Club);
    expect(onlyClubs.length).toEqual(13);
    expect(isClubsOnly).toBe(true);
  });
});
