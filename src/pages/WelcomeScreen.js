import React, { useState } from "react";
import styled from "styled-components";
import { mobileBreakpoint, tabletBreakpoint, Button } from "../styles";

const Container = styled.div`
  text-align: center;
`;

const OptionsContainer = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;

  @media (max-width: ${tabletBreakpoint}) {
    flex-direction: column;
  }
`;

const OptionBox = styled.div`
  padding: 30px;
  margin: 10px;
`;

const InputButtonContainer = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: ${mobileBreakpoint}) {
    flex-direction: column;
  }
`;

const JoinButton = styled(Button)`
  margin-left: 10px;

  @media (max-width: ${mobileBreakpoint}) {
    margin-left: auto;
    margin-top: 10px;
  }
`;

const WelcomeScreen = ({
  onPlayAgainstComputer,
  onPlayAgainstFriend,
  onCreateRoom,
  playerName,
  onNameChange,
}) => {
  const [roomCode, setRoomCode] = useState();

  const onJoinButtonClick = () => {
    if (!roomCode || roomCode.length === 0) {
      return;
    }

    onPlayAgainstFriend(roomCode);
  };

  const onRoomCodeInputKeyDown = (e) => {
    if (e.key === "Enter") {
      onJoinButtonClick();
    }
  };

  return (
    <Container>
      <p>Hello there, {playerName}. I've been expecting you.</p>
      <button onClick={onNameChange}>Change name</button>

      <OptionsContainer className="child-borders child-shadows-hover">
        <OptionBox>
          <h4>Play against computer</h4>
          <button onClick={() => onPlayAgainstComputer()}>Start</button>
        </OptionBox>

        <OptionBox>
          <h4>Play against your friend</h4>
          <p>Enter room code ...</p>

          <InputButtonContainer>
            <input
              onChange={(e) => setRoomCode(e.target.value)}
              onKeyDown={onRoomCodeInputKeyDown}
              type="text"
              placeholder="Room code!"
            />
            <JoinButton onClick={onJoinButtonClick}>Join</JoinButton>
          </InputButtonContainer>

          <p>... or ...</p>

          <button onClick={() => onCreateRoom()}>
            Create my awesome room!
          </button>
        </OptionBox>
      </OptionsContainer>
    </Container>
  );
};

export default WelcomeScreen;
