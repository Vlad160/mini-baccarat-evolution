import './game-room-pixi.scss';

import { useLayoutEffect, useRef } from 'react';

import { GameManager } from 'pixi/game-manager';
import { GameRoom } from 'game/game-room';
import { observer } from 'mobx-react-lite';

export interface IGameRoomPixi {
  room: GameRoom;
}

export const GameRoomPixi: React.FC<IGameRoomPixi> = observer(({ room }) => {
  const containerRef = useRef<HTMLDivElement>();
  const managerRef = useRef<GameManager>(null);

  useLayoutEffect(() => {
    if (managerRef.current || !containerRef.current) {
      return;
    }

    managerRef.current = new GameManager(room, containerRef.current);

    return () => {
      managerRef.current.destroy();
      managerRef.current = null;
    };
  }, []);

  return <div className="grp" ref={containerRef} />;
});
