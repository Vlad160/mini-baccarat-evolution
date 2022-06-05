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

  constructor(
    private container: HTMLElement,
    soundMuted: boolean,
    private onLoad: () => void
  ) {
    this.app = new Application({
      width: 1280,
      height: 720,
      backgroundColor: 0x1099bb,
      resolution: 1,
      antialias: true,
    });

    this.app.loader.baseUrl = 'assets';
    this.soundManager = new SoundManager(this.app.loader, soundMuted);
    this.soundManager.loadAssets();
    this.loadAssets();
    this.app.loader.onComplete.add(this.onLoaded);
    this.app.loader.onError.add(() => console.log('Error!'));
    this.loadingScreen = new LoadingScreen({
      width: this.app.view.width,
      height: this.app.view.height,
    });
    this.app.stage.addChild(this.loadingScreen);
    this.app.loader.onLoad.add(this.onProgress);
    this.app.loader.load();
    this.container.appendChild(this.app.view);
  }

  init(): void {
    this.betAreas = new BetsArea(this.app, this.manager, this.soundManager);

    const playerX = (3 / 8) * this.app.view.width + PLAYER_CARDS_OFFSET_X;
    const bankerX = this.app.view.width / 2 + BANKER_CARDS_OFFSET_X;

    const playerY = this.app.view.height / 5 + 10;
    const bankerY = playerY;

    const playerSwipe = -this.app.view.width / 8 - 20;
    const bankerSwipe = playerSwipe + (playerX - bankerX);
    this.roundStatus = new RoundStatus(this.app.ticker, {
      x: this.app.view.width / 2,
      y: this.app.view.height / 2,
    });

    this.playerCards = new Cards(
      this.app,
      {
        x: playerX,
        y: playerY,
      },
      { x: playerSwipe, y: 10 },
      this.soundManager
    );

    this.bankerCards = new Cards(
      this.app,
      {
        x: bankerX,
        y: bankerY,
      },
      { x: bankerSwipe, y: 10 },
      this.soundManager
    );
    this.userStatus = new UserStatus(this.app);
    const background = new Sprite(
      this.app.loader.resources['bg_game.jpg'].texture
    );
    background.width = this.app.view.width;
    background.height = this.app.view.height;

    this.userActions = new UserActions(this.app, this.manager);
    this.statusPanel = new StatusPanel();
    this.gameControls = new GameControls(this.app, this.manager);
    this.soundControl = new SoundControl(
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
