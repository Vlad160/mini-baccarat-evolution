import { Sprite, Texture } from 'pixi.js';
import { IPoint } from './models';

export class CardSprite extends Sprite {
  constructor(texture: Texture, point: IPoint) {
    super(texture);
    this.pivot.set(0.5, 0.5);
    const { x, y } = point;
    this.x = x;
    this.y = y;
  }
}
