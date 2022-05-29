import { Container, Graphics, Text } from 'pixi.js';

export class ActionButton extends Container {
  text: Text;

  constructor(text: string, private onClick: () => void) {
    super();
    this.interactive = true;
    this.buttonMode = true;
    const circle = new Graphics();

    circle.lineStyle(2, 0xfeeb77, 1);
    circle.beginFill(0x650a5a, 1);
    circle.drawCircle(0, 0, 40);
    circle.endFill();
    this.addChild(circle);
    this.text = new Text(text);
    this.text.anchor.set(0.5, 0.5);
    this.text.width = 80 - 4;
    this.addChild(this.text);
    this.on('pointerdown', this.onPoinerClick);
  }

  onPoinerClick = () => {
    this.onClick();
  };
}
