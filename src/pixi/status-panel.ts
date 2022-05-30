import { Container, Graphics, Text, utils } from 'pixi.js';

const PANEL_WIDTH = 400;
const PANEL_HEIGHT = 100;
const PANEL_COLOR = '#282826';
const OFFSET_X = 32;
const OFFSET_Y = 0;

export class StatusPanel extends Container {
  panel: Graphics;
  text: Text;
  constructor() {
    super();

    this.x = OFFSET_X;
    this.y = OFFSET_Y;
    this.panel = new Graphics();
    this.panel.beginFill(utils.string2hex(PANEL_COLOR), 0.6);
    this.panel.drawRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 5);
    this.panel.endFill();
    this.text = new Text('', {
      fontFamily: 'IBM Plex Serif',
      fontSize: 24,
      fill: 0xffffff,
    });

    this.addChild(this.panel, this.text);
  }

  setText(content: string): void {
    this.text.text = content;
    this.text.updateText(true);
    this.text.x = PANEL_WIDTH / 2 - this.text.width / 2;
    this.text.y = PANEL_HEIGHT / 2 - this.text.height / 2;
  }
}
