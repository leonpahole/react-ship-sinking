import React from "react";
import PlayField from "./PlayField";
import styled from "styled-components";
import { GameState } from "../models/GameState";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const useGame = (isMyTurn, onCellShot, gState) => {
  const onCellClicked = (cell) => {
    if (gState === GameState.FINISHED) {
      return;
    }

    if (isMyTurn === false) {
      return;
    }

    onCellShot(cell);
  };

  return [onCellClicked];
};

const GameInProgress = ({
  width,
  height,
  myStateTable,
  enemyStateTable,
  isMyTurn,
  onCellShot,
  gState,
  hasWon,
}) => {
  const [onCellClicked] = useGame(isMyTurn, onCellShot, gState);

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
      <p>{gState === GameState.FINISHED && "Finished won"}</p>
    </div>
  );
};

export default GameInProgress;
