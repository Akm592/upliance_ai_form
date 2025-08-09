// src/features/formBuilder/formBuilderSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { arrayMove } from '@dnd-kit/sortable';
import type { FormSchema, FormField, FieldType } from '../../types';
import { v4 as uuidv4 } from 'uuid';


interface FormBuilderState {
  currentForm: FormSchema;
  savedForms: FormSchema[];
  selectedFieldId: string | null; // New state to track selected field
}

// Helper to create a new, empty form schema
const createNewForm = (): FormSchema => ({
  id: uuidv4(),
  name: 'Untitled Form',
  createdAt: new Date().toISOString(),
  fields: [],
});

const initialState: FormBuilderState = {
  currentForm: createNewForm(),
  savedForms: [],
  selectedFieldId: null, // Initialize selectedFieldId
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setCurrentFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    addField: (state, action: PayloadAction<{ type: FieldType }>) => {
      const newField: FormField = {
        id: uuidv4(),
        type: action.payload.type,
        label: `New ${action.payload.type} field`,
        required: false,
        validations: {},
      };
      state.currentForm.fields.push(newField);
      state.selectedFieldId = newField.id; // Select the newly added field
    },
    deleteField: (state, action: PayloadAction<{ fieldId: string }>) => {
      state.currentForm.fields = state.currentForm.fields.filter(
        (field) => field.id !== action.payload.fieldId
      );
      if (state.selectedFieldId === action.payload.fieldId) {
        state.selectedFieldId = null; // Deselect if the deleted field was selected
      }
    },
    updateField: (state, action: PayloadAction<{ fieldId: string; updates: Partial<FormField> }>) => {
      const field = state.currentForm.fields.find(f => f.id === action.payload.fieldId);
      if (field) {
        Object.assign(field, action.payload.updates);
      }
    },
    reorderFields: (state, action: PayloadAction<{ activeId: string; overId: string }>) => {
      const { activeId, overId } = action.payload;
      const oldIndex = state.currentForm.fields.findIndex((field) => field.id === activeId);
      const newIndex = state.currentForm.fields.findIndex((field) => field.id === overId);
      state.currentForm.fields = arrayMove(state.currentForm.fields, oldIndex, newIndex);
    },
    saveCurrentForm: (state) => {
      const existingIndex = state.savedForms.findIndex(
        (form) => form.id === state.currentForm.id
      );

      if (existingIndex !== -1) {
        state.savedForms[existingIndex] = state.currentForm;
      } else {
        state.savedForms.push(state.currentForm);
      }
      state.currentForm = createNewForm();
      state.selectedFieldId = null;
    },
    loadForms: (state, action: PayloadAction<FormSchema[]>) => {
      state.savedForms = action.payload;
    },
    loadFormForEdit: (state, action: PayloadAction<string>) => {
      const formToEdit = state.savedForms.find((form) => form.id === action.payload);
      if (formToEdit) {
        state.currentForm = formToEdit;
      }
    },
    resetCurrentForm: (state) => {
      state.currentForm = createNewForm();
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter((form) => form.id !== action.payload);
    },
    setSelectedField: (state, action: PayloadAction<string | null>) => { // New reducer
      state.selectedFieldId = action.payload;
    },
  },
});

export const { setCurrentFormName, addField, deleteField, updateField, reorderFields, saveCurrentForm, loadForms, loadFormForEdit, resetCurrentForm, deleteForm, setSelectedField } = formBuilderSlice.actions;
export default formBuilderSlice.reducer;