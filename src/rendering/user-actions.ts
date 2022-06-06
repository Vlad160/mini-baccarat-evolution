import { Container } from 'pixi.js';
import { ActionButton } from './action-button';
import { GameManager } from './game-manager';
import { IDimensions } from './models';
import { TextureManager } from './texture-manager';

const DEAL_OFFSET_X = 200;
const DEAL_OFFSET_Y = 150;
const DEAL_BTN_GLOW_COLOR = 0x99ff99;

const CLEAR_OFFSET_X = 5;
const CLEAR_OFFSET_Y = 200;
const CLEAR_BTN_GLOW_COLOR = 0xff9999;

export class UserActions extends Container {
  disable() {
    this.dealAction.disable();
    this.clearAction.disable();
  }

  enable() {
    this.dealAction.enable();
    this.clearAction.enable();
  }

  private dealAction: ActionButton;

  private clearAction: ActionButton;

  constructor(
    dimensions: IDimensions,
    private textureManager: TextureManager,
    private manager: GameManager
  ) {
    super();

    const { height, width } = dimensions;

    const dealX = width - DEAL_OFFSET_X;
    const dealY = height - DEAL_OFFSET_Y;

    this.dealAction = new ActionButton(
      'DEAL',
      this.textureManager.get('deal-bet.png'),
      DEAL_BTN_GLOW_COLOR,
      this.onDeal,
      { x: dealX, y: dealY }
    );

    const clearX = dealX + this.dealAction.width + CLEAR_OFFSET_X;
    const clearY = height - CLEAR_OFFSET_Y;

    this.clearAction = new ActionButton(
      'CLEAR',
      this.textureManager.get('clear-bet.png'),
      CLEAR_BTN_GLOW_COLOR,
      this.onClear,
      {
        x: clearX,
        y: clearY,
      }
    );

    this.addChild(this.dealAction, this.clearAction);
  }

  onDeal = () => {
    this.manager.dealBet();
  };

  onClear = () => {
    this.manager.clearBet();
  };
}
