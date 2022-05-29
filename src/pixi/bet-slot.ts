import { BetWinner } from '@game';
import { Graphics, GraphicsGeometry, Text } from 'pixi.js';
import { GameManager } from './game-manager';

export interface IReactangleConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  text: BetWinner;
}

export class BetSlot extends Graphics {
  private betAmount: Text;
  constructor(
    public readonly config: IReactangleConfig,
    private manager: GameManager,
    geometry?: GraphicsGeometry
  ) {
    super(geometry);
    this.drawSlot(0xffffff);
    this.interactive = true;
    this.buttonMode = true;
    this.on('pointerdown', this.onClick);
    this.betAmount = new Text('', { fill: 0xffffff });
    this.addChild(this.betAmount);
    this.x = this.config.x;
    this.y = this.config.y;
  }

  private onClick = () => {
    this.manager.adjustBet(this.config.text);
  };

  private drawSlot(color: number, opacity = 0.00001): void {
    this.beginFill(color, opacity);
    // this.lineStyle({ color: utils.string2hex('#b8bcc4'), width: 2 });
    this.drawRoundedRect(0, 0, this.config.width, this.config.height, 2);
    this.endFill();
  }

  setAmount(amount: number): void {
    this.betAmount.text = amount > 0 ? String(amount) : '';
  }
}
