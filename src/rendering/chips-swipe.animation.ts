import { Container, Ticker } from 'pixi.js';
import { Animation } from './animation';

const ANIMATION_TIME = 2000;

export class ChipsSwipeAnimation extends Animation {
  private promise: Promise<void>;

  private resolve: () => void;

  constructor(
    private element: Container,
    private ticker: Ticker,
    private deltaY: number
  ) {
    super();
  }

  private tick = () => {
    const start = Date.now();
    const startY = 0;

    const multi = 50 / this.element.children.length;

    this.element.children.forEach((chip, i) => (chip.y -= multi * i));

    const ticker = () => {
      const passed = Date.now() - start;
      const y = this.easeOutExpo(passed, startY, this.deltaY, ANIMATION_TIME);
      this.element.y = y;

      if (passed >= ANIMATION_TIME) {
        this.ticker.remove(ticker);
        this.resolve();
      }
    };

    return ticker;
  };

  async play(): Promise<void> {
    this.promise = new Promise((resolve) => (this.resolve = resolve));
    this.ticker.add(this.tick());
    return this.promise;
  }
}
