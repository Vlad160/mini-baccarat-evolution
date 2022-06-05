import { Container, Graphics, Text } from 'pixi.js';
import { Dimensions } from './models';
import { ProgressBar } from './progress-bar';

const BACKGROUND_COLOR = 0x000000;

export class LoadingScreen extends Container {
  backgound: Graphics;

  progressBar: ProgressBar;

  constructor(private dimensions: Dimensions) {
    super();
    this.backgound = this.createBackground();
    this.progressBar = new ProgressBar({
      x: this.dimensions.width / 2,
      y: this.dimensions.height / 2,
    });
    this.addChild(this.backgound, this.progressBar);
  }

  private createBackground(): Graphics {
    const graphics = new Graphics();
    graphics.beginFill(BACKGROUND_COLOR);
    graphics.drawRect(0, 0, this.dimensions.width, this.dimensions.height);
    graphics.endFill();
    return graphics;
  }

  setProgress(value: number): void {
    this.progressBar.setPercent(value);
  }
}
