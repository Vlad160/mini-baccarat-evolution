import { ITextStyle, SCALE_MODES, Text as PixiText, TextStyle } from 'pixi.js';

export class Text extends PixiText {
  constructor(
    text: string,
    style?: Partial<ITextStyle> | TextStyle,
    canvas?: HTMLCanvasElement
  ) {
    super(
      text,
      { fill: 0xffffff, fontFamily: 'IBM Plex Serif', fontSize: 32, ...style },
      canvas
    );
    this.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
  }
}
