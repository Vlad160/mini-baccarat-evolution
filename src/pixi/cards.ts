import { Application, Container, Text } from 'pixi.js';
import { Card } from '@game';
import { CardSprite } from './card-sprite';
import { IPoint } from './models';

export class Cards extends Container {
  cards: Card[] = [];
  scoreText: Text;
  private cardsContainer = new Container();

  constructor(
    private app: Application,
    private offset: IPoint = { x: 0, y: 0 }
  ) {
    super();
    this.x = this.offset.x;
    this.y = this.offset.y;
    this.scoreText = new Text('', { fill: 0xffffff });
    this.scoreText.x = -30;
    this.addChild(this.cardsContainer, this.scoreText);
  }

  setCards(cards: Card[]): void {
    if (cards.length === 0) {
      this.cardsContainer.removeChildren();
      this.scoreText.text = '';
    }
    const toRender = cards.filter((c) =>
      this.cards.every((x) => x.id !== c.id)
    );
    const sprites = toRender.map((card, i) =>
      this.getSprite(card, i + this.cards.length)
    );
    if (sprites.length) {
      this.cardsContainer.addChild(...sprites);
    }
    this.cards = cards;
    const total = cards.reduce((acc, card) => acc + card.score, 0) % 10;
    if (this.cards.length > 0) {
      this.scoreText.text = String(total);
    }
  }

  private getSprite(card: Card, index: number): CardSprite {
    const name = `card${card.suit}s${
      card.value ? card.value : card.face[0]
    }.png`;
    const texture = this.app.loader.resources[name].texture;
    const x = index * 16;
    const y = index * 16;
    return new CardSprite(name, texture, { x, y }, this.app);
  }
}
