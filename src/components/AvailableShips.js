import React from "react";
import AvailableShip from "./AvailableShip";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const AvailableShips = ({ ships }) => {
  return (
    <OuterContainer>
      <Container>
        <p>Ships to place:</p>
        {ships.map((s) => (
          <AvailableShip
            key={s.length}
            length={s.length}
            capacity={s.capacity}
            currentCapacity={s.currentCapacity}
          />
        ))}
      </Container>
    </OuterContainer>
  );
};

export default AvailableShips;
