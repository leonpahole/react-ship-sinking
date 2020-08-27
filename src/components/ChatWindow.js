import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { mobileBreakpoint, Button } from "../styles";
import ChatMessage from "./ChatMessage";

const ChatContainer = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  ${(props) => !props.isChatHidden && "width: 17vw;"}
`;

const ChatTopBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;

const ChatHeading = styled.h2`
  margin: unset;
`;

const ChatClickToHideMe = styled.h5`
  margin: unset;
  cursor: pointer;
  ${(props) => props.isChatHidden && "padding: 20px;"}
`;

const ChatBodyContainer = styled.div`
  height: 40vh;
  display: flex;
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
  width: 70%;
`;

const useChat = (chats, onMessageSent) => {
  const [isChatHidden, setIsChatHidden] = useState(false);
  const [message, setMessage] = useState("");
  const [chatDiv, setChatDiv] = useState(null);

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
  ] = useChat(chats, onMessageSent);

  return (
    <ChatContainer isChatHidden={isChatHidden} className="border border-4">
      <ChatTopBar>
        {!isChatHidden && <ChatHeading>CHAT</ChatHeading>}
        <ChatClickToHideMe
          isChatHidden={isChatHidden}
          onClick={toggleChat}
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
