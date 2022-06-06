import { Card } from '@game';
import { Application, Container } from 'pixi.js';
import { CardSprite } from './card-sprite';
import { CardsSwipeAnimation } from './cards-swipe.animation';
import { IPoint } from './models';
import { SoundManager } from './sound-manager';
import { Text } from './text';

export class Cards extends Container {
  cards: Card[] = [];

  scoreText: Text;

  private cardsContainer = new Container();

  constructor(
    private app: Application,
    private soundManager: SoundManager,
    private offset: IPoint = { x: 0, y: 0 },
    private swipeOffset: IPoint = { x: 0, y: 0 }
  ) {
    super();
    this.x = this.offset.x;
    this.y = this.offset.y;
    this.scoreText = new Text('');
    this.scoreText.x = -30;
    this.addChild(this.cardsContainer, this.scoreText);
  }

  setCards(cards: Card[]): void {
    if (cards.length === 0) {
      this.scoreText.text = '';
      this.swipeCards();
      this.cards = [];
      return;
    }
    const toRender = cards.filter((c) =>
      this.cards.every((x) => x.id !== c.id)
    );
    const sprites = toRender.map((card, i) =>
      this.getSprite(card, i + this.cards.length)
    );
    if (sprites.length) {
      this.cardsContainer.addChild(...sprites);
      this.soundManager.cardPlace();
    }
    this.cards = cards;
    const total = cards.reduce((acc, card) => acc + card.score, 0) % 10;
    if (this.cards.length > 0) {
      this.scoreText.text = String(total);
    }
  }

  async swipeCards(): Promise<void> {
    if (this.cardsContainer.children.length > 0) {
      const animation = new CardsSwipeAnimation(
        this.app.ticker,
        this.cardsContainer.children,
        this.swipeOffset
      );
      this.soundManager.cardSlide();
      await animation.play();
      this.cardsContainer.removeChildren();
    }
  }

  private getSprite(card: Card, index: number): CardSprite {
    const name = `card${card.suit}s${
      card.value ? card.value : card.face[0]
    }.png`;
    const texture = this.app.loader.resources[name].texture;
    const x = index * 18;
    const y = index * 18;
    return new CardSprite(name, texture, { x, y }, this.app);
  }
}
