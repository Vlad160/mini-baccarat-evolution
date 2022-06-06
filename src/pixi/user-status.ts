import { Container } from 'pixi.js';
import { Dimensions } from './models';
import { Text } from './text';

export class UserStatus extends Container {
  private money: Text;
  private bet: Text;

  constructor(dimensions: Dimensions) {
    super();
    const { height, width } = dimensions;
    this.money = new Text('CASH $ 0.00');
    this.bet = new Text('BET $ 0.00');
    this.height = 50;
    this.money.y = height - 50 + this.money.height / 2;
    this.bet.y = height - 50 + this.bet.height / 2;
    this.money.x = 0;
    this.bet.x = width - this.bet.width;
    this.addChild(this.money, this.bet);
    this.x = 50;
    this.width = width - 50;
  }

  setMoney(amount: number): void {
    this.money.text = `CASH $ ${amount}`;
  }

  setBet(amount: number): void {
    this.bet.text = `BET $ ${amount}`;
  }
}
