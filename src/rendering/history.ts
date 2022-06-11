import { IRoundResult } from '@game';
import { Container, Graphics, Ticker, utils } from 'pixi.js';
import { SlideAnimation } from './animations/slide.animation';
import { HistoryItem } from './history-item';
import { IDimensions, IPoint } from './models';
import { Text } from './text';

const PANEL_COLOR = utils.string2hex('#282826');
const OFFSET_Y = 150;
const PANEL_WIDTH = 200;
const PANEL_HEIGHT = 320;
const TEXT_OFFSET_Y = 40;
const CHIP_SIZE = 40;
const CHIP_MAX_PER_LINE = PANEL_WIDTH / 40;
const CHIP_PADDING = 5;
const TOGGLER_WIDTH = 40;
const TOGGLER_HEIGHT = 80;
const TOGGLE_OFFSET_X = 30;
const SLIDE_ANIMATION_DURATION = 300;

export class History extends Container {
  private chipsContainer: Container;

  private togglerText: Text;

  private isOpened = true;

  constructor(private dimensions: IDimensions, private ticker: Ticker) {
    super();
    this.x = this.dimensions.width - PANEL_WIDTH;
    this.y = OFFSET_Y;
    const panel = this.createPanel();

    this.chipsContainer = new Container();
    const historyText = new Text('History');
    const toggler = this.createToggler({
      x: panel.x,
      y: panel.height / 2,
    });
    panel.addChild(this.chipsContainer, toggler);
    panel.y = TEXT_OFFSET_Y;
    historyText.x = TEXT_OFFSET_Y;
    historyText.y = 0;
    this.addChild(panel, historyText);
  }

  private createPanel(): Graphics {
    const panel = new Graphics();
    panel.beginFill(PANEL_COLOR, 0.6);
    panel.drawRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 5);
    panel.endFill();
    return panel;
  }

  private onToggle = () => {
    this.isOpened = !this.isOpened;
    const delta = this.width - TOGGLER_WIDTH;
    const slideX = this.isOpened ? -delta : delta;
    const animation = new SlideAnimation(
      this.ticker,
      this,
      { x: slideX, y: 0 },
      SLIDE_ANIMATION_DURATION
    );
    animation
      .play()
      .then(() => (this.togglerText.text = this.isOpened ? 'Hide' : 'Show'));
  };

  private createToggler(position: IPoint): Container {
    const container = new Container();
    container.x = position.x - TOGGLE_OFFSET_X;
    container.y = position.y - TOGGLER_HEIGHT / 2;
    const toggler = new Graphics();
    toggler.beginFill(PANEL_COLOR);
    toggler.drawRoundedRect(0, 0, TOGGLER_WIDTH, TOGGLER_HEIGHT, 5);
    toggler.endFill();
    const text = new Text('Hide', { fontSize: 24 });
    text.rotation = Math.PI * 1.5;
    container.addChild(toggler);
    text.y += toggler.height / 2;
    text.x += toggler.width / 2;
    text.anchor.set(0.5);
    toggler.addChild(text);
    this.togglerText = text;
    toggler.buttonMode = true;
    toggler.interactive = true;
    toggler.on('pointerdown', this.onToggle);
    return container;
  }

  setHistory(history: IRoundResult[]): void {
    this.chipsContainer.removeChildren();
    const chips = history.map((item, i) => {
      return new HistoryItem(
        item,
        {
          x: CHIP_SIZE * (i % CHIP_MAX_PER_LINE) + CHIP_PADDING,
          y: CHIP_SIZE * Math.floor(i / CHIP_MAX_PER_LINE) + CHIP_PADDING,
        },
        i === 0
      );
    });

    if (chips.length > 0) {
      this.chipsContainer.addChild(...chips);
    }
  }
}
