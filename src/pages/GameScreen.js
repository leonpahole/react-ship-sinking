import React, { useState } from "react";
import gameState from "../models/gameState";
import GameInProgress from "../components/GameInProgress";
import ShipPicker from "../components/ShipPicker";

const WIDTH = 10,
  HEIGHT = 10;

const useGame = () => {
  const [state, setState] = useState(gameState.PICKING_SHIPS);
  const [enemyReady, setEnemyReady] = useState(true);
  const [stateTable, setStateTable] = useState(null);

  const onPickingReady = () => {
    setState(enemyReady ? gameState.IN_PROGRESS : gameState.READY);
  };

  const onStartGame = (st) => {
    setStateTable(st);
    onPickingReady();
  };

  return [state, stateTable, onStartGame];
};

const GameScreen = () => {
  const [state, stateTable, onStartGame] = useGame();

  let page = null;

  if (state === gameState.PICKING_SHIPS || state === gameState.READY) {
    page = (
      <ShipPicker
        width={WIDTH}
        height={HEIGHT}
        onReady={(stateTable) => onStartGame(stateTable)}
      />
    );
  } else {
    page = (
      <GameInProgress width={WIDTH} height={HEIGHT} stateTable={stateTable} />
    );
  }

  return page;
};

export default GameScreen;
