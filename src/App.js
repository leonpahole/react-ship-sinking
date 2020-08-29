import React, { useState, useEffect } from "react";
import WelcomeScreen from "./pages/WelcomeScreen";
import styled from "styled-components";
import "./index.css";
import "papercss/dist/paper.min.css";
import { PageType } from "./models/PageType";
import GameScreen from "./pages/GameScreen";
import NamePicker from "./pages/NamePicker";
import {
  doesRoomExistAndIsPlayerInside,
  createRoom,
  joinRoomIfExistsAndIsFree,
} from "./services/roomsClient";
import { LocalStorageItem } from "./models/LocalStorageItem";
import LoadingScreen from "./pages/LoadingScreen";
import { mobileBreakpoint, baseHeadingStyles } from "./styles";

const AppContainer = styled.div`
  padding: 20px;
`;

const TitleHeading = styled.p`
  ${baseHeadingStyles}
  font-size: 70px;
  margin: 20px 0 20px 0;

  @media (min-width: ${mobileBreakpoint}) {
    margin-top: 50px;
    margin-bottom: 40px;
  }
`;

const usePage = () => {
  const [playerName, setPlayerName] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [wrongRoomCodeModalOpen, setWrongRoomCodeModalOpen] = useState(false);

  // check localstorage and determine which page to go to
  useEffect(() => {
    const checkLocalstorageAndSwitchPage = async () => {
      const playerNameS = localStorage.getItem(LocalStorageItem.PLAYER_NAME);
      const roomIdS = localStorage.getItem(LocalStorageItem.ROOM_ID);
      const playerIdS = localStorage.getItem(LocalStorageItem.PLAYER_ID);

      setPlayerName(playerNameS);

      // player already in room?
      if (roomIdS != null && playerIdS != null) {
        const roomExists = await doesRoomExistAndIsPlayerInside(
          roomIdS,
          playerIdS
        );

        if (roomExists) {
          setStateForGameScreen(roomIdS, playerIdS);
          return;
        }
        // clean up invalid data
        else {
          localStorage.removeItem(LocalStorageItem.ROOM_ID);
          localStorage.removeItem(LocalStorageItem.PLAYER_ID);
        }
      }

      // player chose name?
      if (playerNameS != null) {
        setStateForMainScreen(playerNameS);
        return;
      }

      // player at the beginning
      setCurrentPage(PageType.NAME_PICKER);
    };

    checkLocalstorageAndSwitchPage();
  }, []);

  // when we switch to main screen
  const setStateForMainScreen = (name) => {
    setPlayerName(name);
    setCurrentPage(PageType.MAIN_SCREEN);
  };

  // when we switch to game screen
  const setStateForGameScreen = (roomId, playerId) => {
    setRoomId(roomId);
    setPlayerId(playerId);
    setCurrentPage(PageType.GAME_SCREEN);
  };

  // when player chooses or switches name in name picker
  const onNameChosen = (name) => {
    localStorage.setItem(LocalStorageItem.PLAYER_NAME, name);
    setStateForMainScreen(name);
  };

  const closeWrongRoomCodeModal = () => {
    setWrongRoomCodeModalOpen(false);
  };

  // when player clicks on create room (with player or computer)
  const onCreateRoom = async (isComputer) => {
    const { roomId, playerId } = await createRoom(isComputer);
    if (roomId && playerId) {
      localStorage.setItem(LocalStorageItem.ROOM_ID, roomId);
      localStorage.setItem(LocalStorageItem.PLAYER_ID, playerId);
      setStateForGameScreen(roomId, playerId);
    } else {
      setWrongRoomCodeModalOpen(true);
    }
  };

  const onJoinRoom = async (roomId) => {
    const { joinSuccess, playerId } = await joinRoomIfExistsAndIsFree(roomId);
    if (joinSuccess === true && playerId) {
      localStorage.setItem(LocalStorageItem.ROOM_ID, roomId);
      localStorage.setItem(LocalStorageItem.PLAYER_ID, playerId);
      setStateForGameScreen(roomId, playerId);
    } else {
      setWrongRoomCodeModalOpen(true);
    }
  };

  const onNameChange = () => {
    setCurrentPage(PageType.NAME_PICKER);
  };

  const onLeaveGame = () => {
    localStorage.removeItem(LocalStorageItem.ROOM_ID);
    localStorage.removeItem(LocalStorageItem.PLAYER_ID);
    setCurrentPage(PageType.MAIN_SCREEN);
  };

  return [
    currentPage,
    onCreateRoom,
    onJoinRoom,
    onNameChosen,
    playerName,
    onNameChange,
    roomId,
    playerId,
    onLeaveGame,
    wrongRoomCodeModalOpen,
    closeWrongRoomCodeModal,
  ];
};

const App = () => {
  const [
    currentPage,
    onCreateRoom,
    onJoinRoom,
    onNameChosen,
    playerName,
    onNameChange,
    roomId,
    playerId,
    onLeaveGame,
    wrongRoomCodeModalOpen,
    closeWrongRoomCodeModal,
  ] = usePage();

  let page = null;

  if (currentPage == null) {
    page = <LoadingScreen />;
  } else if (currentPage === PageType.NAME_PICKER) {
    page = <NamePicker onNameChosen={onNameChosen} playerName={playerName} />;
  } else if (currentPage === PageType.MAIN_SCREEN) {
    page = (
      <WelcomeScreen
        playerName={playerName}
        onPlayAgainstComputer={async () => await onCreateRoom(true)}
        onPlayAgainstFriend={async (code) => await onJoinRoom(code)}
        onCreateRoom={async () => await onCreateRoom(false)}
        onNameChange={onNameChange}
      />
    );
  } else if (currentPage === PageType.GAME_SCREEN) {
    page = (
      <GameScreen
        roomId={roomId}
        playerId={playerId}
        playerName={playerName}
        onLeaveGame={onLeaveGame}
      />
    );
  }

  return (
    <AppContainer>
      <TitleHeading>Ship sinking.</TitleHeading>
      {page}

      <input
        checked={wrongRoomCodeModalOpen}
        className="modal-state"
        id="modal-1"
        type="checkbox"
      />
      <div className="modal">
        <label className="modal-bg" for="modal-1"></label>
        <div className="modal-body">
          <label
            onClick={closeWrongRoomCodeModal}
            className="btn-close"
            for="modal-1"
          >
            X
          </label>
          <h4 className="modal-title">Wrong join code!</h4>
          <p className="modal-text">
            Room doesn't exist or it is already full! Double check the room code
            you entered.
          </p>
          <div>
            <label
              onClick={closeWrongRoomCodeModal}
              for="modal-1"
              className="paper-btn margin"
            >
              Got it.
            </label>
          </div>
        </div>
      </div>
    </AppContainer>
  );
};

export default App;
