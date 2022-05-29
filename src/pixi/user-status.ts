import { Application, Container, Text } from 'pixi.js';

export class UserStatus extends Container {
  private money: Text;
  private bet: Text;

  constructor(private app: Application) {
    super();
    this.money = new Text('CASH $ 0.00', { fill: 0xffffff });
    this.bet = new Text('BET $ 0.00', { fill: 0xffffff });

    this.height = 50;

    this.money.y = this.app.view.height - 50 + this.money.height / 2;
    this.bet.y = this.app.view.height - 50 + this.bet.height / 2;
    this.money.x = 0;
    this.bet.x = this.app.view.width - this.bet.width;
    this.addChild(this.money, this.bet);
    this.x = 50;
    this.width = this.app.view.width - 50;
  }

  setMoney(amount: number): void {
    this.money.text = `CASH $ ${amount}`;
  }

  setBet(amount: number): void {
    this.bet.text = `BET $ ${amount}`;
  }
}
