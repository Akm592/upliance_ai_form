// src/types/index.ts

// Defines the kinds of input fields the user can add.
export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

// Defines the structure for a single field in the form.
export interface FormField {
  id: string; // A unique identifier (use UUID), crucial for keys and drag-and-drop.
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: any;
  options?: string[]; // Only for 'select' and 'radio' field types.
  validations: {
    minLength?: number;
    maxLength?: number;
    isEmail?: boolean;
    customPassword?: boolean; // e.g., min 8 chars, 1 number
  };
  // Properties for derived fields.
  isDerived?: boolean;
  parentFieldIds?: string[]; // IDs of fields this one depends on.
  formula?: string; // Logic for computation (e.g., 'calculateAge').
}

// Defines the complete schema for a single form.
export interface FormSchema {
  id: string; // Unique ID for the form itself.
  name: string;
  createdAt: string; // Store as an ISO string for easy sorting/display.
  fields: FormField[];
}
