import './game-room-pixi.scss';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { GameManager } from 'pixi/game-manager';
import { GameRoom } from 'game/game-room';
import { observer } from 'mobx-react-lite';

export interface IGameRoomPixi {
  room: GameRoom;
}

const scale = 720 / 1280;

export const GameRoomPixi: React.FC<IGameRoomPixi> = observer(({ room }) => {
  const containerRef = useRef<HTMLDivElement>();
  const managerRef = useRef<GameManager>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();

  const handleResize = useCallback(() => {
    if (!canvas || !containerRef.current) {
      return;
    }
    const width = containerRef.current.offsetWidth;
    const height = Math.min(scale * width, containerRef.current.offsetHeight);
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

  return <div className="grp" ref={containerRef} />;
});
