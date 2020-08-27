import io from "socket.io-client";
import { GameEvent } from "../models/GameEvent";
let socket;

export const initiateSocket = (roomId, playerId, playerName, cb) => {
  socket = io(
    "http://localhost:8080/room?roomId=" +
      roomId +
      "&playerId=" +
      playerId +
      "&playerName=" +
      playerName
  );

  socket.on(GameEvent.CONNECT, cb);
};

export const onGameEvent = (gameEvent, cb) => {
  if (!socket) return;
  socket.on(gameEvent, cb);
};

export const sendGameEvent = (gameEvent, data) => {
  if (!socket) return;
  socket.emit(gameEvent, data);
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
