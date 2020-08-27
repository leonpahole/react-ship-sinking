import React from "react";
import styled from "styled-components";
import { CellState } from "../models/CellState";

const cellStateToColor = (state) => {
  switch (state) {
    case CellState.DESTROYED:
      return "background-danger";
    case CellState.HIT:
      return "background-warning";
    case CellState.MISSED:
      return "background-primary";
    case CellState.SHIP:
    case CellState.SHIP_PLACED:
      return "background-success";
    case CellState.SHIP_PLACING:
      return "background-primary";
    default:
      return "background-secondary";
  }
};

const cellStateToBorderClass = (state) => {
  switch (state) {
    case CellState.DESTROYED:
      return "border-danger";
    case CellState.HIT:
      return "border-warning";
    case CellState.MISSED:
      return "border-secondary";
    case CellState.SHIP:
    case CellState.SHIP_PLACED:
      return "border-success";
    case CellState.SHIP_PLACING:
      return "border-warning";
    default:
      return "border-primary";
  }
};

const Cell = styled.td`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const ShipCell = ({ x, y, state, onClick, onHover, onRightClick }) => (
  <Cell
    className={`border border-4 ${cellStateToBorderClass(
      state
    )} ${cellStateToColor(state)}`}
    key={x + "_" + y}
    state={state}
    onClick={() => onClick && onClick(x, y)}
    onMouseEnter={() => onHover && onHover(x, y)}
    onContextMenu={(e) => {
      e.preventDefault();
      onRightClick && onRightClick(x, y);
    }}
  ></Cell>
);

export default ShipCell;
