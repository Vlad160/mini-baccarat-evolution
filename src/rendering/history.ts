import { BetWinner } from '@game';
import { Container, Graphics, utils } from 'pixi.js';
import { HistoryChip } from './history-chip';
import { IDimensions } from './models';
import { Text } from './text';

const PANEL_COLOR = utils.string2hex('#282826');
const OFFSET_Y = 150;
const PANEL_WIDTH = 200;
const PANEL_HEIGHT = 320;
const TEXT_OFFSET_Y = 40;
const CHIP_SIZE = 40;
const CHIP_MAX_PER_LINE = PANEL_WIDTH / 40;
const CHIP_PADDING = 5;

export class History extends Container {
  private chipsContainer: Container;

  constructor(private dimensions: IDimensions) {
    super();
    this.x = this.dimensions.width - PANEL_WIDTH;
    this.y = OFFSET_Y;
    const panel = this.createPanel();

    this.chipsContainer = new Container();
    const historyText = new Text('History');
    panel.addChild(this.chipsContainer);
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

  setHistory(history: BetWinner[]): void {
    this.chipsContainer.removeChildren();
    const chips = history.map((item, i) => {
      return new HistoryChip(item, {
        x: CHIP_SIZE * (i % CHIP_MAX_PER_LINE) + CHIP_PADDING,
        y: CHIP_SIZE * Math.floor(i / CHIP_MAX_PER_LINE) + CHIP_PADDING,
      });
    });

    if (chips.length > 0) {
      this.chipsContainer.addChild(...chips);
    }
  }
}
