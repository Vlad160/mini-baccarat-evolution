import { Container } from 'pixi.js';
import { ActionButton } from './action-button';
import { GameManager } from './game-manager';
import { IDimensions } from './models';
import { TextureManager } from './texture-manager';

const CLEAR_OFFSET_X = 200;
const CLEAR_OFFSET_Y = 150;
const CLEAR_BTN_GLOW_COLOR = 0x99ff99;

export class UserActions extends Container {
  disable() {
    this.clearAction.disable();
  }

  enable() {
    this.clearAction.enable();
  }

  private clearAction: ActionButton;

  constructor(
    dimensions: IDimensions,
    private textureManager: TextureManager,
    private manager: GameManager
  ) {
    super();

    const { height, width } = dimensions;

    const position = {
      x: width - CLEAR_OFFSET_X,
      y: height - CLEAR_OFFSET_Y,
    };

    this.clearAction = new ActionButton(
      'CLEAR',
      this.textureManager.get('clear-bet.png'),
      CLEAR_BTN_GLOW_COLOR,
      this.onClear,
      position
    );
    this.addChild(this.clearAction);
  }

  onClear = () => {
    this.manager.clearBet();
  };
}
