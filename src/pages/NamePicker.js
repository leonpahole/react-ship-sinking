import React, { useState } from "react";
import styled from "styled-components";
import { mobileBreakpoint, baseHeadingStyles, Button } from "../styles";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const SubtitleHeading = styled.p`
  ${baseHeadingStyles}
  font-size: 40px;
  margin: unset;
  margin-bottom: 40px;
`;

const FormContainer = styled.div`
  display: flex;
  margin-bottom: 20px;

  @media (max-width: ${mobileBreakpoint}) {
    flex-direction: column;
  }
`;

const StartButton = styled(Button)`
  margin-left: 10px;

  @media (max-width: ${mobileBreakpoint}) {
    margin-left: auto;
    margin-top: 10px;
  }
`;

const Disclaimer = styled.p`
  margin-top: 40px;
`;

const NamePicker = ({ onNameChosen, playerName }) => {
  const [name, setName] = useState(playerName || "");

  const onNameInputKeyDown = (e) => {
    if (e.key === "Enter") {
      onStartButtonClick();
    }
  };

  const onStartButtonClick = () => {
    if (name.length > 0) {
      onNameChosen(name);
    }
  };

  let subtitleContent = "What should I call you?*";
  let inputPlaceholder = "My name is...";
  if (playerName && playerName.length > 0) {
    subtitleContent = `You are not ${playerName} anymore, huh?
    Fine, fine, I'll let you change it.*`;
    inputPlaceholder = "My NEW Name is...";
  }

  return (
    <Container>
      <SubtitleHeading>{subtitleContent}</SubtitleHeading>
      <FormContainer>
        <input
          value={name}
          onKeyDown={onNameInputKeyDown}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder={inputPlaceholder}
          id="nameInput"
        />

        <StartButton onClick={onStartButtonClick}>Let's-a-go!</StartButton>
      </FormContainer>

      <Disclaimer>
        *You should enter your real name. Or not. I won't check.
      </Disclaimer>
    </Container>
  );
};

export default NamePicker;
