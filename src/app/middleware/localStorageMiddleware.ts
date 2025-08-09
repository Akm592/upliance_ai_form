// src/app/middleware/localStorageMiddleware.ts
import type { Middleware, Action } from '@reduxjs/toolkit';
import { saveFormsToStorage } from '../../services/storage';
import type { FormSchema } from '../../types';

interface RootState {
  formBuilder: {
    savedForms: FormSchema[];
  };
}

function isAction(action: unknown): action is Action {
  return typeof action === 'object' && action !== null && 'type' in action;
}

export const localStorageMiddleware: Middleware = store => next => (action: unknown) => {
  const result = next(action);
  if (isAction(action) && action.type.startsWith('formBuilder/')) {
    const { savedForms } = (store.getState() as RootState).formBuilder;
    saveFormsToStorage(savedForms);
  }
  return result;
};