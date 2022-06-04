import { DisplayObject, Ticker } from 'pixi.js';
import { Animation } from './animation';
import { IPoint } from './models';

export class ScaleAnimation extends Animation {
  private promise: Promise<void>;
  private resolve: () => void;

  constructor(
    private element: DisplayObject,
    private startScale: IPoint,
    private endScale: IPoint,
    private ticker: Ticker,
    private time: number
  ) {
    super();
  }

  private tick = () => {
    const start = Date.now();
    this.element.scale.set(this.startScale.x, this.startScale.y);
    const endScaleX = this.endScale.x - this.startScale.x;
    const endScaleY = this.endScale.y - this.startScale.y;
    const ticker = () => {
      const passed = Date.now() - start;
      const scaleX = this.easeOutExpo(
        passed,
        this.startScale.x,
        endScaleX,
        this.time
      );
      const scaleY = this.easeOutExpo(
        passed,
        this.startScale.y,
        endScaleY,
        this.time
      );
      this.element.scale.x = scaleX;
      this.element.scale.y = scaleY;
      if (
        this.element.scale.x >= this.endScale.x &&
        this.element.scale.y >= this.endScale.y
      ) {
        this.element.scale.set(this.endScale.x, this.endScale.y);
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
