import { Container } from 'pixi.js';
import { IDimensions } from './models';
import { Text } from './text';

const MARGIN = 50;

export class UserStatus extends Container {
  private money: Text;

  private bet: Text;

  constructor(dimensions: IDimensions) {
    super();
    const { height, width } = dimensions;
    this.money = new Text('CASH $ 0.00');
    this.bet = new Text('BET $ 0.00');
    this.height = MARGIN;
    this.money.y = height - MARGIN;
    this.bet.y = height - MARGIN;
    this.money.x = 0;
    this.bet.x = width - this.bet.width;
    this.addChild(this.money, this.bet);
    this.x = MARGIN;
    this.width = width - MARGIN;
  }

  setMoney(amount: number): void {
    this.money.text = `CASH $ ${amount}`;
  }

  setBet(amount: number): void {
    this.bet.text = `BET $ ${amount}`;
  }
}
