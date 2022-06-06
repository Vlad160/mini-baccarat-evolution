import { Application, Sprite } from 'pixi.js';
import { IPoint } from './models';

export const CHIP_WIDTH = 47.6;
export const CHIP_HEIGTH = 29.4;

export class Chip extends Sprite {
  constructor(app: Application, private pos: IPoint) {
    super(app.loader.resources['chip.png'].texture);
    this.width = CHIP_WIDTH;
    this.height = CHIP_HEIGTH;
    this.anchor.set(0.5);
    this.x = this.pos.x;
    this.y = this.pos.y;
  }
}
