const ships = [
  { length: 4, capacity: 1 },
  { length: 3, capacity: 1 },
  { length: 2, capacity: 0 },
  { length: 1, capacity: 0 },
];

export const initialShips = (shipsAlreadyPlaced) => {
  return ships.map((s) => {
    return { ...s, currentCapacity: shipsAlreadyPlaced ? s.capacity : 0 };
  });
};
