import React from "react";
import styled from "styled-components";
import { CellState } from "../models/CellState";

const cellStateToColor = (state) => {
  switch (state) {
    case CellState.DESTROYED:
      return "red";
    case CellState.HIT:
      return "orange";
    case CellState.MISSED:
      return "gray";
    case CellState.SHIP:
    case CellState.SHIP_PLACED:
      return "#838383";
    case CellState.SHIP_PLACING:
      return "#d9d9d8";
    default:
      return "white";
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
  background-color: ${(props) => cellStateToColor(props.state)};
`;

const ShipCell = ({ x, y, state, onClick, onHover, onRightClick }) => (
  <Cell
    className={`border border-4 ${cellStateToBorderClass(state)}`}
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
