import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import contactReducer from './slices/contactSlice';
import { persistMiddleware } from './middleware/persist';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    contact: contactReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
