import { Sprite, Texture } from 'pixi.js';
import { GameManager } from './game-manager';
import { Dimensions } from './models';
import { SoundManager } from './sound-manager';
import { TextureManager } from './texture-manager';

const WIDTH = 48;
const HEIGHT = 48;
const PADDING = 16;

export class SoundControl extends Sprite {
  volumeOnTexture: Texture;

  volumeOffTexture: Texture;

  constructor(
    dimensions: Dimensions,
    private textureManager: TextureManager,
    private soundManager: SoundManager,
    private manager: GameManager
  ) {
    const volumeOnTexture = textureManager.get('volume-on.png');
    const volumeOffTexture = textureManager.get('volume-off.png');
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
