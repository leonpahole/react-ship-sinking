import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { mobileBreakpoint, Button } from "../styles";
import ChatMessage from "./ChatMessage";

const ChatContainer = styled.div`
  ${(props) => !props.isChatHidden && "height: 60vh;"}
  ${(props) =>
    !props.isChatHidden &&
    "min-width: 17vw;"}

  @media (max-width: ${mobileBreakpoint}) {
    ${(props) => !props.isChatHidden && "height: 70vh;"}
    ${(props) => !props.isChatHidden && "width: 80vw;"}
  }

  position: fixed;
  right: 20px;
  bottom: 20px;
  background: white;
  display: flex;
  flex-direction: column;
`;

const ChatTopBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
`;

const ChatHeading = styled.h2`
  margin: unset;
`;

const ChatClickToHideMe = styled.h5`
  margin: unset;
  ${(props) => props.isChatHidden && "padding: 20px;"}
  ${(props) =>
    props.newMessagesAvailable && "background: #a7342d; color: white;"}
`;

const ChatBodyContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: auto;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

const ChatMessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 10px;
`;

const InputButtonContainer = styled.div`
  display: flex;

  @media (max-width: ${mobileBreakpoint}) {
    flex-direction: column;
  }
`;

const SendButton = styled(Button)`
  margin-left: 10px;
  width: 30%;

  @media (max-width: ${mobileBreakpoint}) {
    margin-left: auto;
    margin-top: 10px;
  }
`;

const MessageInput = styled.input`
  width: 100%;
`;

const useChat = (chats, onMessageSent) => {
  const [isChatHidden, setIsChatHidden] = useState(true);
  const [message, setMessage] = useState("");
  const [chatDiv, setChatDiv] = useState(null);
  const [newMessagesAvailable, setNewMessagesAvailable] = useState(false);

  const chatDivRef = useCallback((node) => {
    setChatDiv(node);
    if (node) {
      nodeScrollToBottom(node);
    }
  }, []);

  const toggleChat = () => {
    const newState = !isChatHidden;
    setIsChatHidden(newState);

    if (!newState) {
      scrollToBottom();
      setNewMessagesAvailable(false);
    }
  };

  const onSendButtonClick = () => {
    let messageToSend = message.trim();
    if (messageToSend.length > 0) {
      onMessageSent(message);
      setMessage("");
    }
  };

  const onMessageInputKeyDown = (e) => {
    if (e.key === "Enter") {
      onSendButtonClick();
    }
  };

  useEffect(() => {
    scrollToBottom();
    if (isChatHidden) {
      setNewMessagesAvailable(true);
    }
  }, [chats]);

  const scrollToBottom = () => {
    if (chatDiv) {
      nodeScrollToBottom(chatDiv);
    }
  };

  const nodeScrollToBottom = (node) => {
    node.scrollIntoView({ behavior: "smooth" });
  };

  return [
    message,
    setMessage,
    isChatHidden,
    toggleChat,
    chatDivRef,
    onMessageInputKeyDown,
    onSendButtonClick,
    newMessagesAvailable,
  ];
};

const ChatWindow = ({ chats, onMessageSent }) => {
  const [
    message,
    setMessage,
    isChatHidden,
    toggleChat,
    chatDivRef,
    onMessageInputKeyDown,
    onSendButtonClick,
    newMessagesAvailable,
  ] = useChat(chats, onMessageSent);

  return (
    <ChatContainer isChatHidden={isChatHidden} className="border border-4">
      <ChatTopBar onClick={toggleChat}>
        {!isChatHidden && <ChatHeading>CHAT</ChatHeading>}
        <ChatClickToHideMe
          newMessagesAvailable={newMessagesAvailable}
          isChatHidden={isChatHidden}
          className="text-secondary"
        >
          {isChatHidden ? "Show chat" : "(click to hide me)"}
        </ChatClickToHideMe>
      </ChatTopBar>
      {!isChatHidden && (
        <ChatBodyContainer>
          <hr></hr>
          <ChatMessagesContainer>
            {chats &&
              chats.map((chat, i) => <ChatMessage key={i} chat={chat} />)}
            <div ref={chatDivRef}></div>
          </ChatMessagesContainer>
          <InputButtonContainer>
            <MessageInput
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={onMessageInputKeyDown}
              type="text"
              placeholder="Chat here"
            />
            <SendButton onClick={onSendButtonClick}>Send</SendButton>
          </InputButtonContainer>
        </ChatBodyContainer>
      )}
    </ChatContainer>
  );
};

export default ChatWindow;
