import { wait } from '@common';
import { BetWinner, IRoundResult, UserResultStatus } from '@game';
import { Container, Graphics, Ticker } from 'pixi.js';
import { ChipsSwipeAnimation } from './animations';
import { Chip } from './chip';
import { GameManager } from './game-manager';
import { IDimensions } from './models';
import { SoundManager } from './sound-manager';
import { Text } from './text';
import { TextureManager } from './texture-manager';

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
    private dimensions: IDimensions,
    private ticker: Ticker,
    private textureManager: TextureManager,
    private soundManager: SoundManager
  ) {
    super();
    this.area = this.drawArea(0xffffff);
    this.interactive = true;
    this.buttonMode = true;
    this.on('pointerdown', this.onClick);
    this.betAmount = new Text('', { fontSize: 24, fill: 0x000000 });
    this.betAmount.pivot.set(0.5);
    this.betAmount.anchor.set(0.5);
    this.betAmount.skew.x = Math.PI / 8;
    this.x = this.config.x;
    this.y = this.config.y;
    this.addChild(this.area, this.chipsContainer, this.betAmount);
  }

  get renderedChipsAmount(): number {
    return this.chipsContainer.children.length;
  }

  get renderedChips(): Chip[] {
    return this.chipsContainer.children as Chip[];
  }

  private onClick = () => {
    this.manager.acceptBet(this.config.type);
  };

  private drawArea(color: number, opacity = 0.001): Graphics {
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
      const lastChip = this.renderedChips[this.renderedChips.length - 1];
      this.betAmount.y = lastChip.y;
      this.betAmount.x = lastChip.x;
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
      this.ticker,
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
    return new Chip(this.textureManager.get('chip.png'), {
      x: this.config.width / 2,
      y: this.config.height / 2 - CHIP_OFFSET_Y * index,
    });
  }
}
