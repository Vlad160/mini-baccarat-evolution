import { Deck } from './deck';
import { Player } from './player';

export class Game {
  players: Player[] = [];
  deck: Deck;

  constructor() {
    this.deck = new Deck();
  }
}
