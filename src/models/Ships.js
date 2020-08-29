const ships = [
  { length: 4, capacity: 1 },
  { length: 3, capacity: 2 },
  { length: 2, capacity: 3 },
  { length: 1, capacity: 4 },
];

export const initialShips = (shipsAlreadyPlaced) => {
  return ships.map((s) => {
    return { ...s, currentCapacity: shipsAlreadyPlaced ? s.capacity : 0 };
  });
};
