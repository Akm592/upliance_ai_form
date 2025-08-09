// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import formBuilderReducer from '../features/formBuilder/formBuilderSlice';
import { localStorageMiddleware } from './middleware/localStorageMiddleware'; // Import the middleware

export const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware) as const, // Explicitly cast to const
});

// Define RootState and AppDispatch after the store is created
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;