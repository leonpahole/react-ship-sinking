import React from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
`;

const LoadingScreen = () => {
  return (
    <Container>
      <p>Loading... or something...</p>
    </Container>
  );
};

export default LoadingScreen;
