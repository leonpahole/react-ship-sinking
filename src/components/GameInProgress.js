import React, { useState, useCallback } from "react";
import PlayField from "./PlayField";
import styled from "styled-components";
import { shootCell } from "../services/mockShipSinkingService";
import { cellState, initialState } from "../models/cellState";

const Container = styled.table`
  display: flex;
  justify-content: center;
`;

const useGame = (width, height, st) => {
  const [myStateTable, setMyStateTable] = useState([...st]);
  const [enemyStateTable, setEnemyStateTable] = useState(
    initialState(width, height)
  );
  const [isMyTurn, setIsMyTurn] = useState(true);

  const updateStateTable = useCallback(
    (x, y, state, mine = true) => {
      let stateTableCopy;
      if (mine) {
        stateTableCopy = [...myStateTable];
      } else {
        stateTableCopy = [...enemyStateTable];
      }

      stateTableCopy[x][y] = state;

      if (mine) {
        setMyStateTable(stateTableCopy);
      } else {
        setEnemyStateTable(stateTableCopy);
      }
    },
    [myStateTable, enemyStateTable]
  );

  const onCellClicked = (cell) => {
    if (isMyTurn === false) {
      return;
    }

    const hit = shootCell(cell.x, cell.y);
    let state = cellState.MISSED;
    if (hit) {
      state = cellState.HIT;
    }

    updateStateTable(cell.x, cell.y, state, false);
    setIsMyTurn(false);
  };

  return [isMyTurn, myStateTable, enemyStateTable, onCellClicked];
};

const GameInProgress = ({ width, height, stateTable }) => {
  const [isMyTurn, myStateTable, enemyStateTable, onCellClicked] = useGame(
    width,
    height,
    stateTable
  );

  return (
    <div>
      <Container>
        <PlayField width={width} height={height} stateTable={myStateTable} />
        <PlayField
          width={width}
          height={height}
          stateTable={enemyStateTable}
          onCellClicked={onCellClicked}
        />
      </Container>
      <p>{isMyTurn && "Your turn"}</p>
    </div>
  );
};

export default GameInProgress;
