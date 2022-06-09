import { Container } from 'pixi.js';
import { IDimensions } from './models';
import { Text } from './text';

const OFFSET_Y = 50;
const OFFSET_X = 25;

export class UserStatus extends Container {
  private money: Text;

  private bet: Text;

  private roomMaxBet: Text;

  constructor(dimensions: IDimensions) {
    super();
    const { height, width } = dimensions;
    this.money = new Text('CASH $ 0.00');
    this.bet = new Text('BET $ 0.00');
    this.roomMaxBet = new Text(`Max bet: $ 0`);
    this.roomMaxBet.y = height - OFFSET_Y - 32;
    this.roomMaxBet.x = 0;
    this.money.y = height - OFFSET_Y;
    this.bet.y = height - OFFSET_Y;
    this.money.x = 0;
    this.bet.x = width + this.bet.width;
    this.addChild(this.money, this.bet, this.roomMaxBet);
    this.x = OFFSET_X;
    this.width = width - OFFSET_X;
    this.y = 0;
  }

  setMoney(amount: number): void {
    this.money.text = `CASH $ ${amount}`;
  }

  setBet(amount: number): void {
    this.bet.text = `BET $ ${amount}`;
  }

  setRoomMaxBet(amount: number): void {
    this.roomMaxBet.text = `Max bet: $ ${amount}`;
  }
}
