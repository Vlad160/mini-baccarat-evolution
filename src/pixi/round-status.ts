import { IRoundResult, wait } from '@game';
import { Container, Graphics, Ticker, Text, utils } from 'pixi.js';
import { IPoint } from './models';
import { ScaleAnimation } from './scale-animation.animation';

const PANEL_COLOR = '#282826';
const WIDTH = 300;
const HEIGHT = 150;

export class RoundStatus extends Container {
  panel: Graphics;
  text: Text;

  constructor(private ticker: Ticker, private pos: IPoint) {
    super();
    this.drawPanel();
    this.x = this.pos.x - WIDTH / 2;
    this.y = this.pos.y - HEIGHT / 2;
    this.addChild(this.panel, this.text);
  }

  private drawPanel(): void {
    this.panel = new Graphics();
    this.panel.beginFill(utils.string2hex(PANEL_COLOR), 0.9);
    this.panel.drawRoundedRect(0, 0, WIDTH, HEIGHT, 5);
    this.panel.endFill();
    this.text = new Text('', {
      fontFamily: 'IBM Plex Serif',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center',
    });
    this.text.anchor.set(0.5);
    this.pivot.set(0.5);
    this.text.x = this.panel.width / 2;
    this.text.y = this.panel.height / 2;
    this.visible = false;
  }

  show(result: IRoundResult): void {
    if (result.earnings === null) {
      return;
    }
    if (result.earnings === 0) {
      this.text.text = 'You lost';
    } else {
      this.text.text = `You won\n$${result.earnings}`;
    }
    this.text.updateText(false);
    this.text.y = this.panel.height / 2;
    this.visible = true;
    const animation = new ScaleAnimation(
      this,
      { x: 0.5, y: 0.5 },
      { x: 1, y: 1 },
      this.ticker,
      300
    );
    animation
      .play()
      .then(() => wait(2000))
      .then(() => (this.visible = false));
  }
}
