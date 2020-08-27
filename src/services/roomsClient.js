import config from "../config";

const apiUrl = config.apiUrl;

export const doesRoomExistAndIsPlayerInside = async (roomId, playerId) => {
  const requestOptions = {
    method: "GET",
  };

  const response = await fetch(
    `${apiUrl}/room/${roomId}/playerInside/${playerId}`,
    requestOptions
  );
  const data = await response.json();
  return data.roomExists;
};

export const createRoom = async (isComputer = false) => {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify({ isComputer }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(`${apiUrl}/room`, requestOptions);
  const data = await response.json();
  return { playerId: data.playerId, roomId: data.roomId };
};

export const joinRoomIfExistsAndIsFree = async (roomId) => {
  const requestOptions = {
    method: "POST",
  };

  const response = await fetch(`${apiUrl}/room/${roomId}/join`, requestOptions);
  const data = await response.json();
  return { playerId: data.playerId, joinSuccess: data.joinSuccess };
};
