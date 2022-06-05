import { Container, Graphics, utils } from 'pixi.js';
import { IPoint } from './models';
import { Text } from './text';

const OFFSET_Y = 100;
const LOAD_RECT_WIDTH = 400;
const LOAD_RECT_HEIGHT = 20;
const TEXT_Y = 40;
const INNER_BAR_FILL = utils.string2hex('#217949');
const OUTER_BAR_FILL = 0x99ff99;
const OUTER_BAR_OPACITY = 0.1;

export class ProgressBar extends Container {
  private innerBar: Graphics;
  private outerBar: Graphics;

  private loadingText: Text;

  constructor(private pos: IPoint) {
    super();
    this.loadingText = this.drawLoadingText();
    this.innerBar = this.createInnerBar();
    this.outerBar = this.createOuterBar();
    this.addChild(this.outerBar, this.innerBar, this.loadingText);
    this.pivot.x = this.width / 2;
    this.pivot.y = this.height / 2;
    this.x = pos.x;
    this.y = pos.y + OFFSET_Y;
  }

  private drawLoadingText(): Text {
    const loadingText = new Text('');
    loadingText.y = TEXT_Y;
    loadingText.anchor.set(0.5);
    loadingText.position.x = LOAD_RECT_WIDTH / 2;
    return loadingText;
  }

  private createOuterBar(): Graphics {
    const graphics = new Graphics();
    graphics.beginFill(OUTER_BAR_FILL, OUTER_BAR_OPACITY);
    graphics.drawRoundedRect(
      0,
      0,
      LOAD_RECT_WIDTH,
      LOAD_RECT_HEIGHT,
      LOAD_RECT_HEIGHT
    );
    graphics.endFill();
    return graphics;
  }

  private createInnerBar(): Graphics {
    const graphics = new Graphics();
    graphics.beginFill(INNER_BAR_FILL);
    graphics.drawRoundedRect(
      0,
      0,
      LOAD_RECT_WIDTH,
      LOAD_RECT_HEIGHT,
      LOAD_RECT_HEIGHT
    );
    graphics.endFill();
    graphics.width = 0;
    return graphics;
  }

  setPercent(value: number): void {
    this.innerBar.scale.x = value / 100;
    this.loadingText.text = `Loaded ${value.toFixed(0)}%`;
  }
}
