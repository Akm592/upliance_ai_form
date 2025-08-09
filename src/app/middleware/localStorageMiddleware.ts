// src/app/middleware/localStorageMiddleware.ts
import type { Middleware } from 'redux'; // Use type import
import type { RootState } from '../store'; // Use type import
import { saveFormsToStorage } from '../../services/storage';
import { saveCurrentForm, loadForms } from '../../features/formBuilder/formBuilderSlice';
import type { AnyAction } from '@reduxjs/toolkit'; // Use type import for AnyAction

export const localStorageMiddleware: Middleware<{}, RootState> =
  ({ getState }) =>
  (next) =>
  (action: AnyAction) => { // Explicitly type action
    const result = next(action);

    // Only save to localStorage if the action is one that modifies savedForms
    if (action.type === saveCurrentForm.type || action.type === loadForms.type) {
      const savedForms = getState().formBuilder.savedForms;
      saveFormsToStorage(savedForms);
    }

    return result;
  };