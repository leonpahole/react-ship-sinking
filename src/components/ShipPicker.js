import React, { useState, useCallback } from "react";
import styled from "styled-components";
import PlayField from "./PlayField";
import AvailableShips from "./AvailableShips";
import {
  cellState,
  initialState,
  getCellPath,
  canCellBePlaced,
  getShipPathAtCell,
} from "../models/cellState";
import { ships } from "../models/ships";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const MainContainer = styled.div`
  display: flex;
`;

const useShipPicker = (width, height) => {
  const [stateTable, setStateTable] = useState(initialState(width, height));
  const [cellClicked, setCellClicked] = useState(null);
  const [cellHovered, setCellHovered] = useState(null);
  const [availableShips, setAvailableShips] = useState(ships);
  const [allShipsPlaced, setAllShipsPlaced] = useState(false);

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

      setStateOnPlacingCells(cellState.SHIP_PLACED, true);
      setAvailableShips(availableShips);

      setCellClicked(null);
      setCellHovered(null);
    }
  };

  const updateStateTable = useCallback(
    (x, y, state) => {
      let stateTableCopy = [...stateTable];
      stateTableCopy[x][y] = state;
      setStateTable(stateTableCopy);
    },
    [stateTable]
  );

  const setStateOnPlacingCells = useCallback(
    (state = cellState.UNTOUCHED, withClickedCell = false) => {
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          if (
            stateTable[x][y] === cellState.SHIP_PLACING &&
            (withClickedCell || !(x === cellClicked.x && y === cellClicked.y))
          ) {
            updateStateTable(x, y, state);
          }
        }
      }
    },
    [cellClicked, height, stateTable, width]
  );

  const cancelPlacement = useCallback(() => {
    setStateOnPlacingCells(cellState.UNTOUCHED, true);
    setCellClicked(null);
    setCellHovered(null);
  }, [setStateOnPlacingCells]);

  const onCellClicked = (cell) => {
    if (cellClicked == null) {
      if (canCellBePlaced(cell.x, cell.y, stateTable) === true) {
        setCellClicked({ x: cell.x, y: cell.y });
        updateStateTable(cell.x, cell.y, cellState.SHIP_PLACING);
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

      setStateOnPlacingCells(cellState.UNTOUCHED);
    }

    const path = getCellPath(cellClicked, cell, stateTable, getMaxShipLength());
    if (path != null) {
      for (let i = 0; i < path.length; i++) {
        updateStateTable(path[i].x, path[i].y, cellState.SHIP_PLACING);
      }
    }

    setCellHovered({ x: cell.x, y: cell.y });
  };

  // when any cell in grid is right clicked
  const onCellRightClicked = useCallback(
    (cell) => {
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
          updateStateTable(shipPath[i].x, shipPath[i].y, cellState.UNTOUCHED);
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
        }
      }
    },
    [
      allShipsPlaced,
      availableShips,
      cancelPlacement,
      cellClicked,
      stateTable,
      updateStateTable,
    ]
  );

  return [
    onCellClicked,
    onCellHover,
    onCellRightClicked,
    stateTable,
    availableShips,
    allShipsPlaced,
  ];
};

const ShipPicker = ({ width, height, onReady }) => {
  const [
    onCellClicked,
    onCellHover,
    onCellRightClicked,
    stateTable,
    availableShips,
    allShipsPlaced,
  ] = useShipPicker(width, height);

  return (
    <Container>
      <h2>Pick your ships</h2>

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
      <button disabled={!allShipsPlaced} onClick={() => onReady(stateTable)}>
        I am ready!
      </button>
    </Container>
  );
};

export default ShipPicker;
