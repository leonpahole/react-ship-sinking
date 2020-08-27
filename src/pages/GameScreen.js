import React, { useState, useEffect, useRef } from "react";
import { GameState } from "../models/GameState";
import GameInProgress from "../components/GameInProgress";
import ShipPicker from "../components/ShipPicker";
import { GameEvent } from "../models/GameEvent";
import { CellState } from "../models/CellState";
import styled from "styled-components";
import {
  initiateSocket,
  disconnectSocket,
  onGameEvent,
  sendGameEvent,
} from "../services/gameSocket";
import LoadingScreen from "./LoadingScreen";
import ChatWindow from "../components/ChatWindow";
import useSound from "use-sound";

import destroySound from "../assets/sounds/destroy.mp3";
import hitSound from "../assets/sounds/hit.mp3";
import missSound from "../assets/sounds/miss.mp3";

const WIDTH = 10,
  HEIGHT = 10;

const RoomCodeParagraph = styled.p`
  text-align: center;
  cursor: pointer;
`;

const LeaveButton = styled.label`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: #deefff;
`;

const YepButton = styled.label`
  background: #f0cbc9 !important;
`;

const ModalButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const useGame = (roomId, playerId, playerName, onLeaveGame) => {
  const [state, setState] = useState(null);
  const [enemyReady, setEnemyReady] = useState(false);
  const [myStateTable, setMyStateTable] = useState(null);
  const [enemyStateTable, setEnemyStateTable] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [amIReady, setAmIReady] = useState(false);
  const [enemyConnected, setIsEnemyConnected] = useState(false);
  const [isComputer, setIsComputer] = useState(null);
  const [chats, setChats] = useState([]);
  const [enemyName, setEnemyName] = useState(null);

  const [missSoundAudio] = useState(new Audio(missSound));
  const [hitSoundAudio] = useState(new Audio(hitSound));
  const [destroySoundAudio] = useState(new Audio(destroySound));

  const updateStateTable = (pointUpdates, mine = true) => {
    if (mine) {
      setMyStateTable((t) => {
        let newMyStateTable = [...t];
        for (let pu of pointUpdates) {
          newMyStateTable[pu.point.x][pu.point.y] = pu.state;
        }
        return newMyStateTable;
      });
    } else {
      setEnemyStateTable((t) => {
        let newEnemyStateTable = [...t];
        for (let pu of pointUpdates) {
          newEnemyStateTable[pu.point.x][pu.point.y] = pu.state;
        }
        return newEnemyStateTable;
      });
    }
  };

  const onReady = (st) => {
    // ready? change it to not ready.
    if (amIReady) {
      sendGameEvent(GameEvent.NOT_READY);
      setAmIReady(false);
    }
    // not ready? change it to ready.
    else {
      sendGameEvent(GameEvent.SHIPS_PICKED, { stateTable: st });
      setAmIReady(true);
    }
  };

  const onCellShot = ({ x, y }) => {
    if (state !== GameState.IN_PROGRESS) {
      return;
    }

    if (!isMyTurn) {
      return;
    }

    if (enemyStateTable[x][y] !== CellState.UNTOUCHED) {
      return;
    }

    sendGameEvent(GameEvent.SHOOT_CELL, { x, y });
  };

  const playSound = (pointUpdates) => {
    if (pointUpdates.length === 0) {
      return;
    }

    const hitState = pointUpdates[0].state;

    switch (hitState) {
      case CellState.MISSED:
        missSoundAudio.play();
        break;

      case CellState.HIT:
        hitSoundAudio.play();
        break;

      case CellState.DESTROYED:
        destroySoundAudio.play();
        break;
    }
  };

  useEffect(() => {
    initiateSocket(roomId, playerId, playerName, () => {
      onGameEvent(GameEvent.ENEMY_READY, ({ isReady }) => {
        setEnemyReady(isReady);
      });

      onGameEvent(GameEvent.ENEMY_CONNECTED_TO_ROOM, () => {
        setIsEnemyConnected(true);
      });

      onGameEvent(GameEvent.ENEMY_DISCONNECTED_FROM_ROOM, () => {
        setIsEnemyConnected(false);
      });

      onGameEvent(
        GameEvent.GAME_INFO,
        ({
          stateTable,
          eStateTable,
          myTurn,
          hasWon,
          gState,
          enemyReady,
          amIReady,
          enemyConnected,
          isComputer,
          chats,
          enemyName,
        }) => {
          setMyStateTable(stateTable);
          setEnemyStateTable(eStateTable);
          setIsMyTurn(myTurn);
          setState(gState);
          setHasWon(hasWon);
          setEnemyReady(enemyReady);
          setAmIReady(amIReady);
          setIsEnemyConnected(enemyConnected);
          setIsComputer(isComputer);
          setChats(chats);
          setEnemyName(enemyName);
        }
      );

      onGameEvent(GameEvent.CHAT_MESSAGE_SENT, ({ chatMessage }) => {
        setChats((c) => [...c, chatMessage]);
      });

      onGameEvent(GameEvent.TURN_CHANGED, ({ yourTurn }) => {
        setIsMyTurn(yourTurn);
      });

      onGameEvent(GameEvent.SHOOT_CELL_RESULT, ({ pointUpdates }) => {
        playSound(pointUpdates);
        updateStateTable(pointUpdates, false);
      });

      onGameEvent(GameEvent.CELL_SHOT, ({ pointUpdates }) => {
        playSound(pointUpdates);
        updateStateTable(pointUpdates, true);
      });

      onGameEvent(GameEvent.GAME_OVER, ({ hasWon }) => {
        setState((s) => GameState.FINISHED);
        setHasWon((w) => hasWon);
      });

      onGameEvent(GameEvent.ENEMY_LEFT, () => {
        setState((s) => GameState.FINISHED);
        setHasWon((w) => true);
        alert("Enemy has left, you won!");
      });
    });

    return () => {
      disconnectSocket();
    };
  }, [roomId, playerId]);

  const onLeaveGameClick = () => {
    sendGameEvent(GameEvent.PLAYER_LEFT, {});
    onLeaveGame();
  };

  const onMessageSent = (message) => {
    sendGameEvent(GameEvent.CHAT_MESSAGE_SENT, { message });
  };

  return [
    state,
    myStateTable,
    enemyReady,
    onReady,
    isMyTurn,
    onCellShot,
    enemyStateTable,
    hasWon,
    onLeaveGameClick,
    amIReady,
    enemyConnected,
    isComputer,
    chats,
    onMessageSent,
    enemyName,
  ];
};

const GameScreen = ({ roomId, playerId, playerName, onLeaveGame }) => {
  const [
    state,
    myStateTable,
    enemyReady,
    onReady,
    isMyTurn,
    onCellShot,
    enemyStateTable,
    hasWon,
    onLeaveGameClick,
    amIReady,
    enemyConnected,
    isComputer,
    chats,
    onMessageSent,
    enemyName,
  ] = useGame(roomId, playerId, playerName, onLeaveGame);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
  };

  let page = null;

  if (state === null) {
    page = <LoadingScreen />;
  } else if (state === GameState.PICKING_SHIPS) {
    page = (
      <ShipPicker
        width={WIDTH}
        height={HEIGHT}
        enemyReady={enemyReady}
        onReady={(stateTable) => onReady(stateTable)}
        pickedStateTable={myStateTable}
        amIReady={amIReady}
        enemyConnected={enemyConnected}
      />
    );
  } else if (myStateTable != null && enemyStateTable != null) {
    page = (
      <GameInProgress
        width={WIDTH}
        height={HEIGHT}
        myStateTable={myStateTable}
        enemyStateTable={enemyStateTable}
        isMyTurn={isMyTurn}
        onCellShot={onCellShot}
        gState={state}
        hasWon={hasWon}
        enemyConnected={enemyConnected}
        myName={playerName}
        enemyName={enemyName}
      />
    );
  }

  return (
    <React.Fragment>
      {state === GameState.PICKING_SHIPS && isComputer === false && (
        <RoomCodeParagraph onClick={copyRoomCode}>
          <span popover-top="Click to copy me!">
            Your room code: <b>{roomId}</b>
          </span>
        </RoomCodeParagraph>
      )}
      {page}
      <LeaveButton
        className="paper-btn margin background-warning"
        for="modal-1"
      >
        Leave room
      </LeaveButton>
      {isComputer === false && (
        <ChatWindow chats={chats} onMessageSent={onMessageSent} />
      )}
      <input className="modal-state" id="modal-1" type="checkbox" />
      <div className="modal">
        <label className="modal-bg" for="modal-1"></label>
        <div className="modal-body">
          <label className="btn-close" for="modal-1">
            X
          </label>
          <h4 className="modal-title">Leave room?</h4>
          <p className="modal-text">
            Are you sure sure sure you wan't to leave this room?
          </p>
          <ModalButtonsContainer>
            <label for="modal-1" className="paper-btn margin">
              Nope.
            </label>
            <YepButton
              for="modal-1"
              className="paper-btn margin background-danger"
              onClick={onLeaveGameClick}
            >
              Yep.
            </YepButton>
          </ModalButtonsContainer>
        </div>
      </div>
    </React.Fragment>
  );
};

export default GameScreen;
