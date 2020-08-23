import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 0px 10px 10px 0px;
`;

const Table = styled.table`
  border-radius: 10px;
  margin-right: 10px;
  width: unset;
`;

const Td = styled.td`
  width: 40px;
  height: 40px;
`;

const capacityToBadgeClass = (capacity) => {
  if (capacity > 0) {
    return "secondary";
  }

  return "success";
};

const AvailableShip = ({ length, capacity, currentCapacity }) => {
  const remainingShipsToPlace = capacity - currentCapacity;

  return (
    <Container>
      <Table>
        <tbody>
          <tr>
            {Array.from({ length }, (_, x) => (
              <Td className="border border-primary border-4" key={x} />
            ))}
          </tr>
        </tbody>
      </Table>
      <span className={`badge ${capacityToBadgeClass(remainingShipsToPlace)}`}>
        x {remainingShipsToPlace}
      </span>
    </Container>
  );
};

export default AvailableShip;
