import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const OptionBox = styled.div`
  padding: 30px;
  border: 1px solid black;
  border-radius: 10px;
  margin: 10px;
`;

const WelcomeScreen = ({
  onPlayAgainstComputer,
  onPlayAgainstFriend,
  onCreateRoom,
}) => {
  const [roomCode, setRoomCode] = useState();

  return (
    <Container>
      <h1>Ship sinking</h1>

      <OptionsContainer>
        <OptionBox>
          <h4>Play against computer</h4>
          <button onClick={() => onPlayAgainstComputer()}>Start</button>
        </OptionBox>

        <OptionBox>
          <h4>Play against your friend</h4>
          <p>Enter room code ...</p>
          <input onChange={(e) => setRoomCode(e.target.value)} type="text" />

          <br />
          <br />

          <button onClick={() => onPlayAgainstFriend(roomCode)}>Join</button>

          <p>... or create new room</p>

          <button onClick={() => onCreateRoom()}>Create</button>
        </OptionBox>
      </OptionsContainer>
    </Container>
  );
};

export default WelcomeScreen;
