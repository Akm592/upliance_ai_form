// src/types/index.ts

// Defines the kinds of input fields the user can add.
export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "password"
  | "email";

// Defines the structure for a single field in the form.
export interface FormField {
  id: string; // Unique identifier (UUID recommended)
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: any;

  // Only for 'select' and 'radio' field types
  options?: string[];

  // Validation rules
  validations?: {
    minLength?: number;
    maxLength?: number;
    isEmail?: boolean; // Email format check
    mustContainNumber?: boolean; // For password fields
  };

  // Derived field properties
  isDerived?: boolean;
  parentFieldIds?: string[]; // IDs of dependent fields
  formula?: string; // JS expression for calculation
}

// Defines the complete schema for a single form.
export interface FormSchema {
  id: string; // Unique form ID
  name: string;
  createdAt: string; // ISO date string
  fields: FormField[];
}
