import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ── Types ─────────────────────────────────────────────── */
export interface PlayerState {
  id: string;
  username: string;
  color: string;
  position: { x: number; y: number; z: number };
  rotation: { y: number };
  floor: number;
  isMoving: boolean;
  customization?: {
    hairStyle: string;
    accessory: string;
  };
}

export interface ChatMessage {
  id: string;
  playerId: string;
  username: string;
  color: string;
  message: string;
  timestamp: number;
}

interface GameState {
  localPlayer: PlayerState | null;
  remotePlayers: Record<string, PlayerState>;
  chatMessages: ChatMessage[];
  currentFloor: number;
  isConnected: boolean;
  isLoading: boolean;
  username: string;
  showChat: boolean;
}

const initialState: GameState = {
  localPlayer: null,
  remotePlayers: {},
  chatMessages: [],
  currentFloor: 1,
  isConnected: false,
  isLoading: true,
  username: "",
  showChat: false,
};

/* ── Slice ─────────────────────────────────────────────── */
const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },

    setLocalPlayer(state, action: PayloadAction<PlayerState>) {
      state.localPlayer = action.payload;
    },

    updateLocalPosition(
      state,
      action: PayloadAction<{
        position: { x: number; y: number; z: number };
        rotation: { y: number };
        floor: number;
        isMoving: boolean;
      }>,
    ) {
      if (state.localPlayer) {
        state.localPlayer.position = action.payload.position;
        state.localPlayer.rotation = action.payload.rotation;
        state.localPlayer.floor = action.payload.floor;
        state.localPlayer.isMoving = action.payload.isMoving;
      }
      state.currentFloor = action.payload.floor;
    },

    setRemotePlayers(state, action: PayloadAction<PlayerState[]>) {
      const map: Record<string, PlayerState> = {};
      action.payload.forEach((p) => {
        map[p.id] = p;
      });
      state.remotePlayers = map;
    },

    addRemotePlayer(state, action: PayloadAction<PlayerState>) {
      state.remotePlayers[action.payload.id] = action.payload;
    },

    removeRemotePlayer(state, action: PayloadAction<string>) {
      delete state.remotePlayers[action.payload];
    },

    updateRemotePlayer(
      state,
      action: PayloadAction<{
        id: string;
        position: { x: number; y: number; z: number };
        rotation: { y: number };
        floor: number;
        isMoving: boolean;
      }>,
    ) {
      const p = state.remotePlayers[action.payload.id];
      if (p) {
        p.position = action.payload.position;
        p.rotation = action.payload.rotation;
        p.floor = action.payload.floor;
        p.isMoving = action.payload.isMoving;
      }
    },

    addChatMessage(state, action: PayloadAction<ChatMessage>) {
      state.chatMessages.push(action.payload);
      // Keep last 100 messages
      if (state.chatMessages.length > 100) {
        state.chatMessages = state.chatMessages.slice(-100);
      }
    },

    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setCurrentFloor(state, action: PayloadAction<number>) {
      state.currentFloor = action.payload;
    },

    toggleChat(state) {
      state.showChat = !state.showChat;
    },
  },
});

export const {
  setUsername,
  setLocalPlayer,
  updateLocalPosition,
  setRemotePlayers,
  addRemotePlayer,
  removeRemotePlayer,
  updateRemotePlayer,
  addChatMessage,
  setConnected,
  setLoading,
  setCurrentFloor,
  toggleChat,
} = gameSlice.actions;

export default gameSlice.reducer;
