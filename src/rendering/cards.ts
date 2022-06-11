import { Card } from '@game';
import { Container, Ticker } from 'pixi.js';
import { ScaleAnimation } from './animations';
import { CardsSwipeAnimation } from './animations/cards-swipe.animation';
import { CardSprite } from './card-sprite';
import { IPoint } from './models';
import { SoundManager } from './sound-manager';
import { Text, TEXT_SHADOW } from './text';
import { TextureManager } from './texture-manager';

const SCORE_OFFSET_X = -30;
const CARD_ANIMATION_DURATION = 500;
const CARD_OFFSET_MULTI = 18;
export class Cards extends Container {
  cards: Card[] = [];

  scoreText: Text;

  private cardsContainer = new Container();

  constructor(
    private ticker: Ticker,
    private textureMananger: TextureManager,
    private soundManager: SoundManager,
    private offset: IPoint = { x: 0, y: 0 },
    private swipeOffset: IPoint = { x: 0, y: 0 }
  ) {
    super();
    this.x = this.offset.x;
    this.y = this.offset.y;
    this.scoreText = new Text('', TEXT_SHADOW);
    this.scoreText.x = SCORE_OFFSET_X;
    this.addChild(this.cardsContainer, this.scoreText);
  }

  setCards(cards: Card[], score: number): void {
    if (cards.length === 0) {
      this.scoreText.text = '';
      this.swipeCards();
      this.cards = [];
      return;
    }
    const cardsToRender = cards.filter((c) =>
      this.cards.every((x) => x.id !== c.id)
    );
    const spritesToRender = cardsToRender.map((card, i) =>
      this.getSprite(card, i + this.cards.length)
    );
    if (spritesToRender.length) {
      this.cardsContainer.addChild(...spritesToRender);
      spritesToRender.forEach((card) => {
        new ScaleAnimation(
          card,
          { x: 0.2, y: 0.2 },
          { x: 0.7, y: 0.7 },
          this.ticker,
          CARD_ANIMATION_DURATION
        ).play();
      });
      this.soundManager.cardPlace();
    }
    this.cards = cards;
    this.scoreText.text = String(score);
  }

  async swipeCards(): Promise<void> {
    if (this.cardsContainer.children.length > 0) {
      const animation = new CardsSwipeAnimation(
        this.ticker,
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
    const texture = this.textureMananger.get(name);
    const x = index * CARD_OFFSET_MULTI;
    const y = index * CARD_OFFSET_MULTI;
    return new CardSprite(texture, { x, y });
  }
}
