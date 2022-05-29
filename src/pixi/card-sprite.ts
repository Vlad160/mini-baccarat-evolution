import { Application, Sprite, Texture } from 'pixi.js';
import { IPoint } from './models';

const SCALE_COEF = 0.6;

export class CardSprite extends Sprite {
  constructor(
    name: string,
    texture: Texture,
    point: IPoint,
    private app: Application
  ) {
    super(texture);
    this.scale.set(SCALE_COEF / 3, SCALE_COEF / 3);
    this.pivot.set(0.5, 0.5);
    app.ticker.add(this.tick);
    const { x, y } = point;
    this.x = x;
    this.y = y;
  }

  tick = (delta: number) => {
    if (this.scale.x >= SCALE_COEF && this.scale.y >= SCALE_COEF) {
      this.scale.set(SCALE_COEF, SCALE_COEF);
      this.app.ticker.remove(this.tick);
      return;
    }
    this.scale.x += 0.05 * delta;
    this.scale.y += 0.05 * delta;
  };
}
