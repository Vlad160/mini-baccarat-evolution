import { ITextStyle, Text as PixiText, TextStyle } from 'pixi.js';

export const TEXT_SHADOW: Partial<ITextStyle> = {
  dropShadow: true,
  dropShadowAlpha: 0.5,
};

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
  }
}
