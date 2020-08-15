import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 0px 10px 10px 10px;
`;

const Table = styled.table`
  border-radius: 10px;
  margin-right: 10px;
  border-collapse: collapse;
  border-spacing: 0;
`;

const Td = styled.td`
  width: 30px;
  height: 30px;
  border: 1px solid black;
  background-color: orange;
`;

const AvailableShip = ({ length, capacity, currentCapacity }) => {
  return (
    <Container>
      <Table>
        <tbody>
          <tr>
            {Array.from({ length }, (_, x) => (
              <Td key={x} />
            ))}
          </tr>
        </tbody>
      </Table>
      x {capacity - currentCapacity}
    </Container>
  );
};

export default AvailableShip;
