import { DisplayObject, Ticker } from 'pixi.js';
import { Animation } from './animation';
import { IPoint } from './models';

const ANIMATION_TIME = 500;

export class CardsSwipeAnimation extends Animation {
  private promise: Promise<void>;
  private resolve: () => void;

  constructor(
    private ticker: Ticker,
    private cards: DisplayObject[],
    private offset: IPoint
  ) {
    super();
  }

  startTicker = () => {
    const angle = Math.PI / 6;
    const start = Date.now();
    const startX = this.cards[0].x;
    const startY = this.cards[0].y;
    this.cards.forEach(({ position }) => position.set(startX, startY));
    const tick = () => {
      const passed = Date.now() - start;
      if (passed <= ANIMATION_TIME) {
        const x = this.easeOutExpo(
          passed,
          startX,
          this.offset.x,
          ANIMATION_TIME
        );
        const y = this.easeOutExpo(
          passed,
          startY,
          this.offset.y,
          ANIMATION_TIME
        );
        const rotate = this.easeLinear(passed, 0, angle, ANIMATION_TIME);
        this.cards.forEach((card) => {
          card.rotation = rotate;
          card.position.set(x, y);
        });
      } else {
        this.resolve();
        this.ticker.remove(tick);
      }
    };

    return tick;
  };

  play(): Promise<void> {
    this.promise = new Promise((resolve) => (this.resolve = resolve));
    this.ticker.add(this.startTicker());
    return this.promise;
  }
}
