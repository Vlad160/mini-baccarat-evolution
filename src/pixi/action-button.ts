import { GlowFilter } from '@pixi/filter-glow';
import { Container, Graphics, Sprite, Texture, utils } from 'pixi.js';
import { IPoint } from './models';
import { Text } from './text';

const TEXT_RECT_COLOR = '#282826';

export class ActionButton extends Container {
  text: Text;
  circle: Graphics;
  textReactangle: Graphics;
  sprite: Sprite;
  disabled = false;

  constructor(
    text: string,
    private texture: Texture,
    private glowColor: number,
    private onClick: () => void,
    { x, y }: IPoint = { x: 0, y: 0 }
  ) {
    super();
    this.x = x;
    this.y = y;
    this.circle = this.createCircleArea();
    this.sprite = this.createSprite();
    this.circle.addChild(this.sprite);
    this.addChild(this.circle);

    this.text = this.createText(text);
    this.textReactangle = this.createTextRectangle(this.text);

    this.addChild(this.textReactangle, this.text);
    this.circle.on('pointerdown', this.onPoinerClick);
    this.circle.on('pointerover', this.onPoinerOver);
    this.circle.on('pointerout', this.onPoinerOut);
  }

  private createCircleArea(): Graphics {
    const circle = new Graphics();
    circle.interactive = true;
    circle.buttonMode = true;
    circle.drawCircle(0, 0, 40);
    return circle;
  }

  private createText(content: string): Text {
    const text = new Text(content, {
      fontSize: 18,
    });
    text.anchor.set(0.5, 0.5);
    text.updateText(false);
    text.y = this.circle.height / 2 + 20;
    text.x = this.circle.x;
    return text;
  }

  private createTextRectangle(text: Text): Graphics {
    const rect = new Graphics();
    rect.beginFill(utils.string2hex(TEXT_RECT_COLOR));
    rect.drawRoundedRect(
      text.x - text.width / 2 - 8,
      text.y - text.height / 2,
      text.width + 16,
      text.height,
      3
    );
    rect.endFill();
    return rect;
  }

  private createSprite(): Sprite {
    const sprite = new Sprite(this.texture);
    sprite.anchor.set(0.5, 0.5);
    return sprite;
  }

  private onPoinerClick = () => {
    if (this.disabled) {
      return;
    }
    this.onClick();
  };

  private onPoinerOver = () => {
    if (this.disabled) {
      return;
    }
    this.circle.scale.x += 0.05;
    this.circle.scale.y += 0.05;
    this.circle.filters = [
      new GlowFilter({
        color: this.glowColor,
        distance: 15,
        outerStrength: 2,
        innerStrength: 1,
        quality: 0.5,
      }),
    ];
  };
  private onPoinerOut = () => {
    if (this.disabled) {
      return;
    }
    this.circle.scale.x -= 0.05;
    this.circle.scale.y -= 0.05;
    this.circle.filters = [];
  };

  disable(): void {
    this.disabled = true;
    this.circle.buttonMode = false;
    this.alpha = 0.5;
  }

  enable(): void {
    this.disabled = false;
    this.circle.buttonMode = true;
    this.alpha = 1;
  }
}
