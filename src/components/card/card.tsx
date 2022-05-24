import './card.scss';

import { CardSuit, ICard, SuitToSymbol } from '../../game/card';

export interface ICardProps {
  card: ICard;
}

export interface ISuitProps {
  suit: CardSuit;
}

export const Suit: React.FC<ISuitProps> = ({ suit }) => {
  return <span>{SuitToSymbol[suit]}</span>;
};

export const Card: React.FC<ICardProps> = ({ card }) => {
  const color =
    card.suit === CardSuit.Heart || card.suit === CardSuit.Diamond
      ? 'red'
      : 'black';
  return (
    <div className="card" style={{ color }}>
      <div className="card__header">
        <div>{card.value ?? card.face[0]}</div>
        <div>
          <Suit suit={card.suit} />
        </div>
      </div>
      <div className="card__footer">
        <div>{card.value ?? card.face[0]}</div>
        <div>
          <Suit suit={card.suit} />
        </div>
      </div>
    </div>
  );
};
