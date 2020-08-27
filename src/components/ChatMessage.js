import React, { useState } from "react";
import styled from "styled-components";

const MessageWrapper = styled.div`
  padding: 10px 0px;
  ${(props) => props.from == null && "font-style: italic;"}
`;

const ChatMessage = ({ chat }) => {
  return (
    <MessageWrapper from={chat.from}>
      {chat.from && <b>{chat.isMine ? "Me" : chat.from}:</b>} {chat.message}
    </MessageWrapper>
  );
};

export default ChatMessage;
