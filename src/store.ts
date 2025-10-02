import { configureStore } from "@reduxjs/toolkit";
import vigataglesSlice from "./features/vigatebles/vigatebles";

export const store = configureStore({
  reducer: {
    vigatebles: vigataglesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
