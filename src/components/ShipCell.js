import React from "react";
import styled from "styled-components";
import { cellState } from "../models/cellState";

const cellStateToColor = (state) => {
  switch (state) {
    case cellState.DESTROYED:
      return "red";
    case cellState.HIT:
      return "orange";
    case cellState.MISSED:
      return "gray";
    case cellState.SHIP:
    case cellState.SHIP_PLACED:
      return "black";
    case cellState.SHIP_PLACING:
      return "yellow";
    default:
      return "blue";
  }
};

const Cell = styled.td`
  width: 40px;
  height: 40px;
  border: 1px solid black;
  cursor: pointer;
  background-color: ${(props) => cellStateToColor(props.state)};
`;

const ShipCell = ({ x, y, state, onClick, onHover, onRightClick }) => (
  <Cell
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
