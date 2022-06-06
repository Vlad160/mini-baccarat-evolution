import { Sprite, Texture } from 'pixi.js';
import { IPoint } from './models';

export const CHIP_WIDTH = 72;
export const CHIP_HEIGTH = 44;

export class Chip extends Sprite {
  constructor(texture: Texture, private pos: IPoint) {
    super(texture);
    this.width = CHIP_WIDTH;
    this.height = CHIP_HEIGTH;
    this.anchor.set(0.5);
    this.x = this.pos.x;
    this.y = this.pos.y;
  }
}
