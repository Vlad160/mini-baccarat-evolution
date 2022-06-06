import { Application, Sprite } from 'pixi.js';
import { ASSETS } from './assets';
import { BetsArea } from './bets-area';
import { Cards } from './cards';
import { GameControls } from './game-controls';
import { GameManager } from './game-manager';
import { LoadingScreen } from './loading-screen';
import { RoundStatus } from './round-status';
import { SoundControl } from './sound-control';
import { SoundManager } from './sound-manager';
import { StatusPanel } from './status-panel';
import { UserActions } from './user-actions';
import { UserStatus } from './user-status';

const PLAYER_CARDS_OFFSET_X = 25;
const BANKER_CARDS_OFFSET_X = 10;
export class GameApplication {
  userActions: UserActions;

  gameControls: GameControls;

  statusPanel: StatusPanel;

  betAreas: BetsArea;

  readonly app: Application;

  bankerCards: Cards;

  playerCards: Cards;

  userStatus: UserStatus;

  loaded = false;

  manager: GameManager;

  roundStatus: RoundStatus;

  soundManager: SoundManager;

  soundControl: SoundControl;

  loadingScreen: LoadingScreen;

  dimensions: { width: number; height: number; scale: number };

  constructor(
    private container: HTMLElement,
    soundMuted: boolean,
    private onLoad: () => void
  ) {
    this.app = new Application({
      width: 1600,
      height: 900,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
      antialias: true,
    });

    this.dimensions = {
      width: this.app.screen.width,
      height: this.app.screen.height,
      scale: 1,
    };

    this.app.loader.baseUrl = 'assets';
    this.soundManager = new SoundManager(this.app.loader, soundMuted);
    this.soundManager.loadAssets();
    this.loadAssets();
    this.app.loader.onComplete.add(this.onLoaded);
    this.app.loader.onError.add(() => console.log('Error!'));
    this.loadingScreen = new LoadingScreen(this.dimensions);
    this.app.stage.addChild(this.loadingScreen);
    this.app.loader.onLoad.add(this.onProgress);
    this.app.loader.load();
    this.container.appendChild(this.app.view);
  }

  init(): void {
    this.betAreas = new BetsArea(
      this.dimensions,
      this.app,
      this.manager,
      this.soundManager
    );

    const playerX = (3 / 8) * this.dimensions.width + PLAYER_CARDS_OFFSET_X;
    const bankerX = this.dimensions.width / 2 + BANKER_CARDS_OFFSET_X;

    const playerY = this.dimensions.height / 5 + 12.5;
    const bankerY = playerY;

    const playerSwipe = -this.dimensions.width / 8 - 20;
    const bankerSwipe = playerSwipe + (playerX - bankerX);
    this.roundStatus = new RoundStatus(this.app.ticker, {
      x: this.dimensions.width / 2,
      y: this.dimensions.height / 2,
    });

    this.playerCards = new Cards(
      this.app,
      this.soundManager,

      {
        x: playerX,
        y: playerY,
      },
      { x: playerSwipe, y: 12.5 }
    );

    this.bankerCards = new Cards(
      this.app,
      this.soundManager,

      {
        x: bankerX,
        y: bankerY,
      },
      { x: bankerSwipe, y: 12.5 }
    );
    this.userStatus = new UserStatus(this.dimensions);
    const background = new Sprite(
      this.app.loader.resources['bg_game.jpg'].texture
    );
    background.width = this.dimensions.width;
    background.height = this.dimensions.height;

    this.userActions = new UserActions(this.dimensions, this.app, this.manager);
    this.statusPanel = new StatusPanel();
    this.gameControls = new GameControls(
      this.dimensions,
      this.app,
      this.manager
    );
    this.soundControl = new SoundControl(
      this.dimensions,
      this.app,
      this.soundManager,
      this.manager
    );

    this.app.stage.removeChildren();
    this.app.stage.addChild(
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
    if (this.app.loader) {
      this.loadingScreen.setProgress(this.app.loader.progress);
    }
  };

  private onLoaded = () => {
    this.loaded = true;
    this.onLoad();
  };

  private loadAssets(): void {
    ASSETS.forEach((file) => this.app.loader.add(file, file));
  }
}
