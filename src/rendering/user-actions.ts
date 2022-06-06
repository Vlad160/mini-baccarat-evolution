import { Container } from 'pixi.js';
import { ActionButton } from './action-button';
import { GameManager } from './game-manager';
import { Dimensions } from './models';
import { TextureManager } from './texture-manager';

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
    dimensions: Dimensions,
    private textureManager: TextureManager,
    private manager: GameManager
  ) {
    super();

    const { height, width } = dimensions;

    const dealX = width - 200;
    const dealY = height - 150;

    this.dealAction = new ActionButton(
      'DEAL',
      this.textureManager.get('deal-bet.png'),
      0x99ff99,
      this.onDeal,
      { x: dealX, y: dealY }
    );

    const clearX = dealX + this.dealAction.width + 5;
    const clearY = height - 200;

    this.clearAction = new ActionButton(
      'CLEAR',
      this.textureManager.get('clear-bet.png'),
      0xff9999,
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
