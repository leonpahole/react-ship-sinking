import React, { useState } from "react";
import styled from "styled-components";
import PlayField from "./PlayField";
import AvailableShips from "./AvailableShips";
import {
  CellState,
  initialState,
  getCellPath,
  canCellBePlaced,
  getShipPathAtCell,
} from "../models/CellState";
import { initialShips } from "../models/Ships";
import { tabletBreakpoint } from "../styles";
import clickSound from "../assets/sounds/click.mp3";
import placeSound from "../assets/sounds/place.mp3";
import removeSound from "../assets/sounds/remove.mp3";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const MainContainer = styled.div`
  display: flex;

  @media (max-width: ${tabletBreakpoint}) {
    flex-direction: column;
  }
`;

const useShipPicker = (width, height, pickedStateTable, amIReady) => {
  const shipsAlreadyPlaced = pickedStateTable != null;

  const [stateTable, setStateTable] = useState(
    shipsAlreadyPlaced ? pickedStateTable : initialState(width, height)
  );
  const [cellClicked, setCellClicked] = useState(null);
  const [cellHovered, setCellHovered] = useState(null);
  const [availableShips, setAvailableShips] = useState(
    initialShips(shipsAlreadyPlaced)
  );
  const [allShipsPlaced, setAllShipsPlaced] = useState(shipsAlreadyPlaced);
  const [clickSoundAudio] = useState(new Audio(clickSound));
  const [placeSoundAudio] = useState(new Audio(placeSound));
  const [removeSoundAudio] = useState(new Audio(removeSound));

  const pauseAllSounds = () => {
    clickSoundAudio.pause();
    placeSoundAudio.pause();
    removeSoundAudio.pause();
  };

  const getMaxShipLength = () => {
    if (allShipsPlaced) {
      return 0;
    }

    for (let i = 0; i < availableShips.length; i++) {
      if (availableShips[i].capacity > availableShips[i].currentCapacity) {
        return availableShips[i].length;
      }
    }

    return 0;
  };

  const placeShip = (length) => {
    if (allShipsPlaced) {
      return;
    }

    const shipIndex = availableShips.findIndex(
      (s) => s.length === length && s.currentCapacity < s.capacity
    );

    if (shipIndex >= 0) {
      availableShips[shipIndex].currentCapacity++;

      if (
        availableShips[shipIndex].currentCapacity ===
        availableShips[shipIndex].capacity
      ) {
        const availableShip = availableShips.find(
          (s) => s.currentCapacity < s.capacity
        );
        if (availableShip == null) {
          setAllShipsPlaced(true);
        }
      }

      setStateOnPlacingCells(CellState.SHIP_PLACED, true);
      setAvailableShips(availableShips);

      setCellClicked(null);
      setCellHovered(null);

      pauseAllSounds();
      placeSoundAudio.play();
    }
  };

  const updateStateTable = (x, y, state) => {
    let stateTableCopy = [...stateTable];
    stateTableCopy[x][y] = state;
    setStateTable(stateTableCopy);
  };

  const setStateOnPlacingCells = (
    state = CellState.UNTOUCHED,
    withClickedCell = false
  ) => {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (
          stateTable[x][y] === CellState.SHIP_PLACING &&
          (withClickedCell || !(x === cellClicked.x && y === cellClicked.y))
        ) {
          updateStateTable(x, y, state);
        }
      }
    }
  };

  const cancelPlacement = () => {
    setStateOnPlacingCells(CellState.UNTOUCHED, true);
    setCellClicked(null);
    setCellHovered(null);
  };

  const onCellClicked = (cell) => {
    if (allShipsPlaced) {
      return;
    }

    if (cellClicked == null) {
      if (canCellBePlaced(cell.x, cell.y, stateTable) === true) {
        setCellClicked({ x: cell.x, y: cell.y });
        updateStateTable(cell.x, cell.y, CellState.SHIP_PLACING);

        pauseAllSounds();
        clickSoundAudio.play();
      }
    } else {
      const path = getCellPath(
        cellClicked,
        cell,
        stateTable,
        getMaxShipLength()
      );

      if (path == null) {
        cancelPlacement();
      } else {
        placeShip(path.length + 1);
      }
    }
  };

  const onCellHover = (cell) => {
    if (cellClicked == null) {
      return;
    }

    if (cellHovered != null) {
      if (cellHovered.x === cell.x && cellHovered.y === cell.y) {
        return;
      }

      setStateOnPlacingCells(CellState.UNTOUCHED);
    }

    const path = getCellPath(cellClicked, cell, stateTable, getMaxShipLength());
    if (path != null) {
      for (let i = 0; i < path.length; i++) {
        updateStateTable(path[i].x, path[i].y, CellState.SHIP_PLACING);
      }

      pauseAllSounds();
      clickSoundAudio.play();
    }

    setCellHovered({ x: cell.x, y: cell.y });
  };

  // when any cell in grid is right clicked
  const onCellRightClicked = (cell) => {
    if (amIReady) {
      return;
    }

    // if some cell is clicked, then just cancel that cell
    if (cellClicked) {
      cancelPlacement();
      return;
    }

    const shipPath = getShipPathAtCell(cell, stateTable);

    // check if ship is placed on this cell
    if (shipPath != null) {
      // set all states to "untouched" where the ship used to be
      for (let i = 0; i < shipPath.length; i++) {
        updateStateTable(shipPath[i].x, shipPath[i].y, CellState.UNTOUCHED);
      }

      // add ship to capacity ships
      // find ship with this length
      const shipIndex = availableShips.findIndex(
        (s) => s.length === shipPath.length && s.currentCapacity > 0 // safety check to not go in negative
      );

      // if ship exists (it should)
      if (shipIndex >= 0) {
        // remove capacity
        availableShips[shipIndex].currentCapacity--;

        // if all ships were placed, change this to not all ships placed
        if (allShipsPlaced === true) {
          setAllShipsPlaced(false);
        }

        setAvailableShips(availableShips);

        pauseAllSounds();
        removeSoundAudio.play();
      }
    }
  };

  return [
    onCellClicked,
    onCellHover,
    onCellRightClicked,
    stateTable,
    availableShips,
    allShipsPlaced,
  ];
};

const ShipPicker = ({
  width,
  height,
  onReady,
  enemyReady,
  pickedStateTable,
  amIReady,
  enemyConnected,
  enemyName,
}) => {
  const [
    onCellClicked,
    onCellHover,
    onCellRightClicked,
    stateTable,
    availableShips,
    allShipsPlaced,
  ] = useShipPicker(width, height, pickedStateTable, amIReady);

  const getEnemyName = () => {
    if (enemyName) {
      return enemyName;
    }

    return "Enemy";
  };

  let readyState = "";
  if (!enemyConnected) {
    readyState = getEnemyName() + " is not in the room. ";
  } else {
    if (enemyReady) {
      readyState = getEnemyName() + " is ready. ";
    } else {
      readyState = getEnemyName() + " is picking. ";
    }
  }

  if (amIReady) {
    readyState += "You are ready!";
  } else {
    readyState += "You are picking.";
  }

  return (
    <Container>
      <p>
        Pick your ships. Choose carefully! (right click on ship to remove it)
      </p>

      <MainContainer>
        <PlayField
          width={width}
          height={height}
          stateTable={stateTable}
          onCellClicked={onCellClicked}
          onCellHover={onCellHover}
          onCellRightClicked={onCellRightClicked}
        />
        <AvailableShips ships={availableShips} />
      </MainContainer>
      <p>{readyState}</p>
      <button
        className={allShipsPlaced ? "background-success" : ""}
        disabled={!allShipsPlaced}
        onClick={() => onReady(stateTable)}
      >
        {amIReady
          ? "Wait, let me change my pick!"
          : "I am ready! Let's do this!"}
      </button>
    </Container>
  );
};

export default ShipPicker;
