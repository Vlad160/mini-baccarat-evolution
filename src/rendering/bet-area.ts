import { BetWinner, IRoundResult, UserResultStatus, wait } from '@game';
import { Application, Container, Graphics } from 'pixi.js';
import { Chip, CHIP_WIDTH } from './chip';
import { ChipsSwipeAnimation } from './animations';
import { GameManager } from './game-manager';
import { Dimensions } from './models';
import { SoundManager } from './sound-manager';
import { Text } from './text';

const CHIP_OFFSET_Y = 5;

export interface IReactangleConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  type: BetWinner;
}

export class BetArea extends Container {
  private betAmount: Text;

  private area: Graphics;

  private chipsContainer = new Container();

  constructor(
    public readonly config: IReactangleConfig,
    private manager: GameManager,
    private dimensions: Dimensions,
    private app: Application,
    private soundManager: SoundManager
  ) {
    super();
    this.area = this.drawArea(0xffffff);
    this.interactive = true;
    this.buttonMode = true;
    this.on('pointerdown', this.onClick);
    this.betAmount = new Text('');
    this.betAmount.x = this.config.width / 2 - CHIP_WIDTH * 1.5;
    this.addChild(this.betAmount);
    this.x = this.config.x;
    this.y = this.config.y;
    this.addChild(this.area, this.chipsContainer);
  }

  get renderedChipsAmount(): number {
    return this.chipsContainer.children.length;
  }

  get renderedChips(): Chip[] {
    return this.chipsContainer.children as Chip[];
  }

  private onClick = () => {
    this.manager.adjustBet(this.config.type);
  };

  private drawArea(color: number, opacity = 0.00001): Graphics {
    const area = new Graphics();
    area.beginFill(color, opacity);
    // area.lineStyle({ color: utils.string2hex('#b8bcc4'), width: 2 });
    area.drawRoundedRect(0, 0, this.config.width, this.config.height, 2);
    area.endFill();
    return area;
  }

  setAmount(amount: number): void {
    if (amount <= 0) {
      this.betAmount.text = '';
      if (this.chipsContainer.children.length !== 0) {
        this.chipsContainer.removeChildren();
      }
    } else {
      this.betAmount.text = String(amount);

      const chipsAmount = Math.floor(amount / 10);
      const length = chipsAmount - this.renderedChipsAmount;
      const chipsToRender = Array.from({ length }, (_, i) =>
        this.getChip(i + this.renderedChipsAmount)
      );
      if (chipsToRender.length > 0) {
        this.chipsContainer.addChild(...chipsToRender);
        this.soundManager.chipsCollide();
      }
      this.betAmount.y = this.renderedChips[this.renderedChips.length - 1].y;
    }
  }

  clearArea(result: IRoundResult): void {
    if (this.chipsContainer.children.length === 0) {
      this.betAmount.text = '';
      return;
    }

    let delta: number;

    if (result.userStatus === UserResultStatus.Won) {
      delta = this.dimensions.height - this.config.y;
    } else {
      delta = -this.dimensions.height;
    }

    const swipeAnimation = new ChipsSwipeAnimation(
      this.chipsContainer,
      this.app.ticker,
      delta
    );
    wait(2000)
      .then(() => {
        this.betAmount.text = '';
        return swipeAnimation.play();
      })
      .then(() => {
        this.chipsContainer.removeChildren();
        this.chipsContainer.x = 0;
        this.chipsContainer.y = 0;
      });
  }

  private getChip(index: number): Chip {
    return new Chip(this.app, {
      x: this.config.width / 2,
      y: this.config.height / 2 - CHIP_OFFSET_Y * index,
    });
  }
}
