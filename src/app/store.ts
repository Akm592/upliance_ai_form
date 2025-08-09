// src/app/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import formBuilderReducer from '../features/formBuilder/formBuilderSlice';
import { localStorageMiddleware } from './middleware/localStorageMiddleware';

const rootReducer = combineReducers({
  formBuilder: formBuilderReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;