import { DisplayObject, Ticker } from 'pixi.js';
import { IPoint } from 'rendering/models';
import { Animation } from './animation';

export class SlideAnimation extends Animation {
  private promise: Promise<void>;

  private resolve: () => void;

  constructor(
    private ticker: Ticker,
    private element: DisplayObject,
    private slideOffset: IPoint,
    private time: number
  ) {
    super();
  }

  private tick() {
    const start = Date.now();
    const startX = this.element.x;
    const startY = this.element.y;
    const targetX = startX + this.slideOffset.x;
    const targetY = startY + this.slideOffset.y;

    const ticker = () => {
      const passed = Date.now() - start;

      if (passed >= this.time) {
        this.element.x = targetX;
        this.element.y = targetY;
        this.ticker.remove(ticker);
        this.resolve();
        return;
      }

      const x = this.easeLinear(passed, startX, this.slideOffset.x, this.time);
      const y = this.easeLinear(passed, startY, this.slideOffset.y, this.time);
      this.element.x = x;
      this.element.y = y;
    };
    return ticker;
  }

  play(): Promise<void> {
    this.promise = new Promise((resolve) => (this.resolve = resolve));
    this.ticker.add(this.tick());
    return this.promise;
  }
}
