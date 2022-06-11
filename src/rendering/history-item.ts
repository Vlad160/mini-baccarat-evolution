import { BetWinner, IRoundResult, UserResultStatus } from '@game';
import { Container, Graphics, utils } from 'pixi.js';
import { IPoint } from './models';
import { Text } from './text';

export const TYPE_TO_COLOR_MAP = {
  [BetWinner.Banker]: utils.string2hex('#ffb80a'),
  [BetWinner.Player]: utils.string2hex('#36c0f5'),
  [BetWinner.Tie]: 0xffffff,
};

export const ROUND_STATUS_TO_COLOR = {
  [UserResultStatus.Won]: 0x00ff00,
  [UserResultStatus.Lose]: 0xff0000,
};

const ITEM_RADIUS = 16;
const FIRST_ITEM_BORDER_COLOR = utils.string2hex('#DA4167');
const INNER_CIRCLE_RADIUS = 5;

export class HistoryItem extends Container {
  constructor(
    private item: IRoundResult,
    pos: IPoint,
    private isFirst = false
  ) {
    super();
    this.x = pos.x + ITEM_RADIUS;
    this.y = pos.y + ITEM_RADIUS;
    const chip = this.createChip();
    const text = this.createText();
    text.x = this.width / 2;
    text.y = this.height / 2;
    this.addChild(chip, text);
  }

  private createChip(): Graphics {
    const circle = new Graphics();
    const { winner, userStatus } = this.item;
    circle.beginFill(TYPE_TO_COLOR_MAP[winner]);
    if (this.isFirst) {
      circle.lineStyle({ color: FIRST_ITEM_BORDER_COLOR, width: 3 });
    }
    circle.drawCircle(0, 0, ITEM_RADIUS);
    circle.endFill();
    if (ROUND_STATUS_TO_COLOR[userStatus]) {
      const innerCircle = new Graphics();
      innerCircle.beginFill(ROUND_STATUS_TO_COLOR[userStatus]);
      innerCircle.drawCircle(
        ITEM_RADIUS - INNER_CIRCLE_RADIUS,
        -ITEM_RADIUS + INNER_CIRCLE_RADIUS,
        INNER_CIRCLE_RADIUS
      );
      innerCircle.endFill();
      circle.addChild(innerCircle);
    }
    return circle;
  }

  private createText(): Text {
    const text = new Text(this.item.winner.toString()[0], {
      fontSize: 24,
      fill: this.item.winner === BetWinner.Tie ? 0x000000 : 0xffffff,
    });
    text.anchor.set(0.5);
    return text;
  }
}
