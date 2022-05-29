import './game-room-pixi.scss';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { BaccaratGameRoom } from 'game/baccarat-game-room';
import { GameApplication } from 'pixi/game-application';
import { GameManager } from 'pixi/game-manager';
import { observer } from 'mobx-react-lite';

export interface IGameRoomPixi {
  room: BaccaratGameRoom;
}

export const GameRoomPixi: React.FC<IGameRoomPixi> = observer(({ room }) => {
  const containerRef = useRef<HTMLDivElement>();
  const appRef = useRef<GameApplication>(null);
  const [loaded, setLoaded] = useState(false);
  const managerRef = useRef<GameManager>(null);

  useLayoutEffect(() => {
    if (appRef.current || !containerRef.current) {
      return;
    }

    appRef.current = new GameApplication(containerRef.current, room, () =>
      setLoaded(true)
    );
    return () => {
      appRef.current.app.destroy(true, true);
      appRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!loaded || managerRef.current) {
      return;
    }
    managerRef.current = new GameManager(room, appRef.current);

    return () => {
      managerRef.current.destroy();
      appRef.current = null;
      managerRef.current = null;
    };
  }, [loaded]);

  return <div className="grp" ref={containerRef} />;
});
