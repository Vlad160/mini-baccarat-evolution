import { BetWinner } from '@game';
import { Container, Graphics } from 'pixi.js';
import { IPoint } from './models';
import { Text } from './text';

export const TYPE_TO_COLOR_MAP = {
  [BetWinner.Banker]: 0xff0000,
  [BetWinner.Player]: 0x00ff00,
  [BetWinner.Tie]: 0xffffff,
};

const RADIUS = 16;

export class HistoryChip extends Container {
  constructor(private winner: BetWinner, pos: IPoint) {
    super();
    this.x = pos.x + RADIUS;
    this.y = pos.y + RADIUS;
    const chip = this.createChip();
    const text = this.createText();
    text.x = this.width / 2;
    text.y = this.height / 2;
    this.addChild(chip, text);
  }

  private createChip(): Graphics {
    const circle = new Graphics();
    circle.beginFill(TYPE_TO_COLOR_MAP[this.winner]);
    circle.drawCircle(0, 0, RADIUS);
    circle.endFill();
    return circle;
  }

  private createText(): Text {
    const text = new Text(this.winner.toString()[0], {
      fontSize: 24,
      fill: this.winner === BetWinner.Tie ? 0x000000 : 0xffffff,
    });
    text.anchor.set(0.5);
    return text;
  }
}
