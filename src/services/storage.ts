// src/services/storage.ts
import type { FormSchema } from '../types'; // Use type import

const FORMS_KEY = 'upliance_forms';

export const saveFormsToStorage = (forms: FormSchema[]): void => {
  localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
};

export const loadFormsFromStorage = (): FormSchema[] => {
  const data = localStorage.getItem(FORMS_KEY);
  return data ? JSON.parse(data) : [];
};