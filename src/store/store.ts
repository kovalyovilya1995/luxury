import { configureStore } from '@reduxjs/toolkit';

import general from './reducer';

export const store = configureStore({
  reducer: {
    general,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
