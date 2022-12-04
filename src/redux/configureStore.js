import thunk from 'redux-thunk';
import { configureStore } from "@reduxjs/toolkit";

export default function(allReducers, initialState) {
  const isDev = (!process.env.NODE_ENV || process.env.NODE_ENV === "development")

  return configureStore({
      reducer: allReducers,
      preloadedState: initialState,
      middleware: [thunk],
      devTools: isDev,
    }
  )
}
