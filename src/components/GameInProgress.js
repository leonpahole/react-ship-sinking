import React from "react";
import PlayField from "./PlayField";
import styled from "styled-components";
import { GameState } from "../models/GameState";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;

const VsHeading = styled.h4`
  margin: unset;
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
  myName,
  enemyName,
}) => {
  const [onCellClicked] = useGame(isMyTurn, onCellShot, gState);

  const gameFinished = () => {
    return gState === GameState.FINISHED;
  };

  return (
    <MainContainer>
      {!gameFinished() && (
        <span className={`badge ${isMyTurn ? "success" : "danger"}`}>
          {isMyTurn ? "Your turn!" : enemyName + "'s turn!"}
        </span>
      )}
      {gameFinished() && (
        <span className={`badge ${hasWon ? "success" : "danger"}`}>
          {hasWon
            ? "YOU WON! You earned a hug."
            : enemyName + " WON! Better luck next time."}
        </span>
      )}
      <Container>
        <PlayField
          width={width}
          height={height}
          stateTable={myStateTable}
          playerName={myName + "(that's you)"}
        />
        <VsHeading>VS</VsHeading>
        <PlayField
          width={width}
          height={height}
          stateTable={enemyStateTable}
          onCellClicked={onCellClicked}
          playerName={enemyName}
        />
      </Container>
    </MainContainer>
  );
};

export default GameInProgress;
