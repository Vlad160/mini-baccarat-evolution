import { Application, Sprite } from 'pixi.js';
import { BetsArea } from './bets-area';
import { Cards } from './cards';
import { GameControls } from './game-controls';
import { GameManager } from './game-manager';
import { LoadingScreen } from './loading-screen';
import { Dimensions as IDimensions } from './models';
import { RoundStatus } from './round-status';
import { SoundControl } from './sound-control';
import { SoundManager } from './sound-manager';
import { StatusPanel } from './status-panel';
import { TextureManager } from './texture-manager';
import { UserActions } from './user-actions';
import { UserStatus } from './user-status';

const PLAYER_CARDS_OFFSET_X = 25;
const BANKER_CARDS_OFFSET_X = 10;
export class GameApplicationView extends Application {
  userActions: UserActions;

  gameControls: GameControls;

  statusPanel: StatusPanel;

  betAreas: BetsArea;

  bankerCards: Cards;

  playerCards: Cards;

  userStatus: UserStatus;

  loaded = false;

  manager: GameManager;

  roundStatus: RoundStatus;

  soundManager: SoundManager;

  soundControl: SoundControl;

  loadingScreen: LoadingScreen;

  dimensions: IDimensions;

  textureManager: TextureManager;

  constructor(
    private container: HTMLElement,
    soundMuted: boolean,
    private onLoad: () => void
  ) {
    super({
      width: 1600,
      height: 900,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
      antialias: true,
    });

    this.dimensions = {
      width: this.screen.width,
      height: this.screen.height,
      scale: 1,
    };

    this.loader.baseUrl = 'assets';
    this.soundManager = new SoundManager(this.loader, soundMuted);
    this.textureManager = new TextureManager(this.loader);
    this.soundManager.loadAssets();
    this.textureManager.loadAssets();
    this.loader.onComplete.add(this.onLoaded);
    this.loader.onError.add(() => console.log('Error!'));
    this.loadingScreen = new LoadingScreen(this.dimensions);
    this.stage.addChild(this.loadingScreen);
    this.loader.onLoad.add(this.onProgress);
    this.loader.load();
    this.container.appendChild(this.view);
  }

  init(): void {
    this.betAreas = new BetsArea(
      this.dimensions,
      this,
      this.manager,
      this.soundManager,
      this.textureManager
    );

    const playerX = (3 / 8) * this.dimensions.width + PLAYER_CARDS_OFFSET_X;
    const bankerX = this.dimensions.width / 2 + BANKER_CARDS_OFFSET_X;

    const playerY = this.dimensions.height / 5 + 12.5;
    const bankerY = playerY;

    const playerSwipe = -this.dimensions.width / 8 - 20;
    const bankerSwipe = playerSwipe + (playerX - bankerX);
    this.roundStatus = new RoundStatus(this.ticker, {
      x: this.dimensions.width / 2,
      y: this.dimensions.height / 2,
    });

    this.playerCards = new Cards(
      this.ticker,
      this.textureManager,
      this.soundManager,

      {
        x: playerX,
        y: playerY,
      },
      { x: playerSwipe, y: 12.5 }
    );

    this.bankerCards = new Cards(
      this.ticker,
      this.textureManager,
      this.soundManager,

      {
        x: bankerX,
        y: bankerY,
      },
      { x: bankerSwipe, y: 12.5 }
    );
    this.userStatus = new UserStatus(this.dimensions);
    const background = new Sprite(this.loader.resources['bg_game.jpg'].texture);
    background.width = this.dimensions.width;
    background.height = this.dimensions.height;

    this.userActions = new UserActions(
      this.dimensions,
      this.textureManager,
      this.manager
    );
    this.statusPanel = new StatusPanel();
    this.gameControls = new GameControls(
      this.dimensions,
      this.textureManager,
      this.manager
    );
    this.soundControl = new SoundControl(
      this.dimensions,
      this.textureManager,
      this.soundManager,
      this.manager
    );

    this.stage.removeChildren();
    this.stage.addChild(
      background,
      this.betAreas,
      this.bankerCards,
      this.playerCards,
      this.userStatus,
      this.userActions,
      this.statusPanel,
      this.roundStatus,
      this.soundControl
    );
  }

  private onProgress = () => {
    if (this.loader) {
      this.loadingScreen.setProgress(this.loader.progress);
    }
  };

  private onLoaded = () => {
    this.loaded = true;
    this.onLoad();
  };
}
