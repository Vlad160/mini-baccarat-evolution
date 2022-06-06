import { Loader, Texture } from 'pixi.js';
import { ASSETS } from './assets';

export class TextureManager {
  constructor(private readonly loader: Loader) {}

  loadAssets(): void {
    ASSETS.forEach((file) => {
      if (this.loader.resources[file]) {
        return;
      }
      this.loader.add(file, file);
    });
  }

  get(name: string): Texture {
    return this.loader.resources[name]?.texture;
  }
}
