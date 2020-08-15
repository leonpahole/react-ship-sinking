const { cellState } = require("../models/cellState");

const state = [
  [
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
  ],
  [
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.SHIP_PLACED,
    cellState.SHIP_PLACED,
    cellState.SHIP_PLACED,
    cellState.SHIP_PLACED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
  ],
  [
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
  ],
  [
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
  ],
  [
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
  ],
  [
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
  ],
  [
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
  ],
  [
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
  ],
  [
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
  ],
  [
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
    cellState.UNTOUCHED,
  ],
];

export const shootCell = (x, y) => {
  return state[x][y] === cellState.SHIP_PLACED;
};

export const onEnemyShootCell = () => {
  return {
    x: Math.floor(Math.random() * 10),
    y: Math.floor(Math.random() * 10),
  };
};
