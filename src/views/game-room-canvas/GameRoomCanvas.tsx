import './game-room-canvas.scss';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { GameManager } from 'rendering/game-manager';
import { GameRoom } from 'game/game-room';
import { observer } from 'mobx-react-lite';
import { CANVAS_SCALE } from 'common/constants';

export interface IGameRoomPixi {
  room: GameRoom;
}

export const GameRoomCanvas: React.FC<IGameRoomPixi> = observer(({ room }) => {
  const containerRef = useRef<HTMLDivElement>();
  const managerRef = useRef<GameManager>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();

  const handleResize = useCallback(() => {
    if (!canvas || !containerRef.current) {
      return;
    }
    const width = containerRef.current.offsetWidth;
    const height = Math.min(
      CANVAS_SCALE * width,
      containerRef.current.offsetHeight
    );
    canvas.style.height = `${height}px`;
  }, [canvas]);

  useLayoutEffect(() => {
    if (managerRef.current || !containerRef.current) {
      return;
    }

    managerRef.current = new GameManager(room, containerRef.current, setCanvas);

    return () => {
      managerRef.current.destroy();
      managerRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    window.addEventListener('resize', handleResize, true);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useLayoutEffect(() => {
    handleResize();
  }, [canvas, handleResize]);

  return <div className="game-room" ref={containerRef} />;
});
