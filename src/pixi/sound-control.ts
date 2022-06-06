import { Application, Sprite, Texture } from 'pixi.js';
import { GameManager } from './game-manager';
import { Dimensions } from './models';
import { SoundManager } from './sound-manager';

const WIDTH = 48;
const HEIGHT = 48;
const PADDING = 16;

export class SoundControl extends Sprite {
  volumeOnTexture: Texture;
  volumeOffTexture: Texture;

  constructor(
    dimensions: Dimensions,
    private app: Application,
    private soundManager: SoundManager,
    private manager: GameManager
  ) {
    const volumeOnTexture = app.loader.resources['volume-on.png'].texture;
    const volumeOffTexture = app.loader.resources['volume-off.png'].texture;
    super(soundManager.muted ? volumeOnTexture : volumeOffTexture);
    this.volumeOnTexture = volumeOnTexture;
    this.volumeOffTexture = volumeOffTexture;
    this.width = WIDTH;
    this.height = HEIGHT;
    this.buttonMode = true;
    this.interactive = true;
    this.x = dimensions.width - this.width - PADDING;
    this.y = PADDING;
    this.on('pointerdown', this.onClick);
  }

  private onClick = () => {
    this.manager.toggleSound();
  };

  setMuted(muted: boolean): void {
    this.soundManager.setMuted(muted);
    this.texture = this.soundManager.muted
      ? this.volumeOnTexture
      : this.volumeOffTexture;
  }
}
