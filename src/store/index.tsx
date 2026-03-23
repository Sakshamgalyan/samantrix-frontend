import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/auth";
import gameReducer from "@/store/slices/game";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
