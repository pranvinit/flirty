import { configureStore } from "@reduxjs/toolkit";

// api imports
import { apiSlice } from "./apiSlice";

// reducer imports
import profileReducer from "../../features/profile/model/profileSlice";
import flirtsReducer from "../../features/flirts/model/flirtsSlice";
import uiReducer from "../../features/ui/model/uiSlice";

// middleware imports
import { listenerMiddleware } from "./middleware/listenerMiddleware";
import { setupListeners } from "./listeners";

let listenersAreSetup = false;

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      profile: profileReducer,
      flirts: flirtsReducer,
      ui: uiReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(apiSlice.middleware),
  });

  if (!listenersAreSetup) {
    setupListeners(listenerMiddleware.startListening);
    listenersAreSetup = true;
  }

  return store;
};
