import { ITextStyle, Text as PixiText, TextStyle } from 'pixi.js';

export class Text extends PixiText {
  constructor(
    text: string,
    style?: Partial<ITextStyle> | TextStyle,
    canvas?: HTMLCanvasElement
  ) {
    super(
      text,
      { ...style, fill: 0xffffff, fontFamily: 'IBM Plex Serif' },
      canvas
    );
  }
}
