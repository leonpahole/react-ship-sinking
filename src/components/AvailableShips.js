import React from "react";
import AvailableShip from "./AvailableShip";

const AvailableShips = ({ ships }) => {
  return (
    <div>
      {ships.map((s) => (
        <AvailableShip
          key={s.length}
          length={s.length}
          capacity={s.capacity}
          currentCapacity={s.currentCapacity}
        />
      ))}
    </div>
  );
};

export default AvailableShips;
