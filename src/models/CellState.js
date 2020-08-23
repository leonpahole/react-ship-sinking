export const CellState = {
  UNTOUCHED: 1,
  HIT: 2,
  MISSED: 3,
  DESTROYED: 4,
  SHIP_PLACING: 5,
  SHIP_PLACED: 6,
};

export const initialState = (width, height) => {
  const field = new Array(width);

  for (let w = 0; w < width; w++) {
    field[w] = new Array(height);

    for (let h = 0; h < height; h++) {
      field[w][h] = CellState.UNTOUCHED;
    }
  }

  return field;
};

export const canCellBePlaced = (x, y, stateTable) => {
  if (stateTable[x][y] === CellState.SHIP_PLACED) {
    return false;
  }

  const width = stateTable.length;
  const height = stateTable[0].length;

  // left
  if (x > 0 && stateTable[x - 1][y] === CellState.SHIP_PLACED) {
    return false;
  }
  // right
  else if (x < width - 1 && stateTable[x + 1][y] === CellState.SHIP_PLACED) {
    return false;
  }
  // up
  else if (y > 0 && stateTable[x][y - 1] === CellState.SHIP_PLACED) {
    return false;
  }
  // down
  else if (y < height - 1 && stateTable[x][y + 1] === CellState.SHIP_PLACED) {
    return false;
  }

  return true;
};

export const getCellPath = (
  { x: beginX, y: beginY },
  { x: endX, y: endY },
  stateTable,
  maxLength
) => {
  let length = 0;
  let direction = 0;
  let isDimensionX = false;

  if (beginX === endX) {
    length = Math.abs(beginY - endY);
    direction = beginY > endY ? -1 : 1;
    isDimensionX = false;
  } else if (beginY === endY) {
    length = Math.abs(beginX - endX);
    direction = beginX > endX ? -1 : 1;
    isDimensionX = true;
  }
  // no path
  else {
    return null;
  }

  length++;

  // ship too long
  if (length > maxLength) {
    return null;
  }

  const path = [];

  if (isDimensionX) {
    for (
      let x = beginX + direction;
      direction > 0 ? x <= endX : x >= endX;
      x += direction
    ) {
      if (canCellBePlaced(x, beginY, stateTable) === false) {
        return null;
      }

      path.push({ x, y: beginY });
    }
  } else {
    for (
      let y = beginY + direction;
      direction > 0 ? y <= endY : y >= endY;
      y += direction
    ) {
      if (canCellBePlaced(beginX, y, stateTable) === false) {
        return null;
      }

      path.push({ x: beginX, y });
    }
  }

  return path;
};

export const getShipPathAtCell = ({ x, y }, stateTable) => {
  // check if this cell has ship placed
  if (stateTable[x][y] !== CellState.SHIP_PLACED) {
    // no
    return null;
  }

  const width = stateTable.length;
  const height = stateTable[0].length;
  const shipCells = [{ x, y }];

  // yes
  // go left as much as possible until end of table or no more ship
  for (
    let xi = x - 1;
    xi >= 0 && stateTable[xi][y] === CellState.SHIP_PLACED;
    xi--
  ) {
    shipCells.push({ x: xi, y });
  }

  // go right as much as possible until end of table or no more ship
  for (
    let xi = x + 1;
    xi < width && stateTable[xi][y] === CellState.SHIP_PLACED;
    xi++
  ) {
    shipCells.push({ x: xi, y });
  }

  // go up as much as possible until end of table or no more ship
  for (
    let yi = y - 1;
    yi >= 0 && stateTable[x][yi] === CellState.SHIP_PLACED;
    yi--
  ) {
    shipCells.push({ x, y: yi });
  }

  // go down as much as possible until end of table or no more ship
  for (
    let yi = y + 1;
    yi < height && stateTable[x][yi] === CellState.SHIP_PLACED;
    yi++
  ) {
    shipCells.push({ x, y: yi });
  }

  return shipCells;
};
