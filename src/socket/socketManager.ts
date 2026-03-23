import { io, Socket } from "socket.io-client";
import { store } from "@/store";
import {
  setLocalPlayer,
  setRemotePlayers,
  addRemotePlayer,
  removeRemotePlayer,
  updateRemotePlayer,
  addChatMessage,
  setConnected,
  type PlayerState,
  type ChatMessage,
} from "@/store/slices/game";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:6000";

let socket: Socket | null = null;
let moveThrottleTimer: ReturnType<typeof setTimeout> | null = null;

export function connectSocket(username: string): Socket {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    autoConnect: true,
  });

  socket.on("connect", () => {
    store.dispatch(setConnected(true));
    socket!.emit("player:join", { username });
  });

  socket.on("disconnect", () => {
    store.dispatch(setConnected(false));
  });

  socket.on(
    "player:welcome",
    (data: { self: PlayerState; players: PlayerState[] }) => {
      store.dispatch(setLocalPlayer(data.self));
      store.dispatch(setRemotePlayers(data.players));
    },
  );

  socket.on("player:joined", (player: PlayerState) => {
    store.dispatch(addRemotePlayer(player));
  });

  socket.on("player:left", (data: { id: string }) => {
    store.dispatch(removeRemotePlayer(data.id));
  });

  socket.on(
    "player:moved",
    (data: {
      id: string;
      position: { x: number; y: number; z: number };
      rotation: { y: number };
      floor: number;
      isMoving: boolean;
    }) => {
      store.dispatch(updateRemotePlayer(data));
    },
  );

  socket.on("player:chat", (msg: ChatMessage) => {
    store.dispatch(addChatMessage(msg));
  });

  return socket;
}

export function sendMovement(
  position: { x: number; y: number; z: number },
  rotation: { y: number },
  floor: number,
  isMoving: boolean,
) {
  if (!socket?.connected) return;

  // Throttle to ~20 updates/sec
  if (moveThrottleTimer) return;
  moveThrottleTimer = setTimeout(() => {
    moveThrottleTimer = null;
  }, 50);

  socket.emit("player:move", { position, rotation, floor, isMoving });
}

export function sendChatMessage(message: string) {
  if (!socket?.connected) return;
  socket.emit("player:chat", { message });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}
