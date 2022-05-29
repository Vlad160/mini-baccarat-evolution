import { Card, CardSuit, Face } from './card';

export function generateSuit(suit: CardSuit): Card[] {
  const numbers: Card[] = Array.from(
    { length: 9 },
    (_, i) =>
      new Card({
        face: null,
        suit,
        value: i + 2,
      })
  );
  const faces: Card[] = Object.values(Face).map(
    (face) =>
      new Card({
        face,
        suit,
        value: null,
      })
  );
  return numbers.concat(faces);
}
