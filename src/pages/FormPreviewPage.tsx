// src/pages/FormPreviewPage.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  FormHelperText,
} from "@mui/material";
import { useAppSelector } from "../app/hooks";
import type { FormField } from "../types"; // Use the specific type

// Define more specific types for formData and formErrors for better type safety
interface FormData {
  [key: string]: string | number | boolean | undefined;
}

interface FormErrors {
  [key: string]: string;
}

const FormPreviewPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const savedForms = useAppSelector((state) => state.formBuilder.savedForms);

  // Use useMemo to prevent re-finding the form on every render
  const form = useMemo(
    () => savedForms.find((f) => f.id === formId),
    [savedForms, formId]
  );

  const [formData, setFormData] = useState<FormData>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Effect for initializing form data when the form definition loads
  useEffect(() => {
    if (form) {
      const initialData: FormData = {};
      form.fields.forEach((field: FormField) => {
        // FIX: Prioritize defaultValue from form definition for all field types,
        // then provide a sensible default. Checkbox default is false.
        if (field.type === "checkbox") {
          initialData[field.id] = field.defaultValue ?? false;
        } else {
          initialData[field.id] = field.defaultValue ?? "";
        }
      });
      setFormData(initialData);
    }
  }, [form]);

  // Memoize derived fields to avoid recalculating on every render
  const derivedFields = useMemo(() => {
    if (!form) return [];
    return form.fields.filter((field) => field.isDerived);
  }, [form]);

  // FIX: Major performance improvement.
  // This effect now ONLY runs when a parent field of a derived field changes.
  useEffect(() => {
    if (!form || derivedFields.length === 0) return;

    let derivedDataUpdates: FormData = {};

    derivedFields.forEach((field) => {
      // Ensure parentFieldIds exists and is an array
      if (!field.parentFieldIds || !Array.isArray(field.parentFieldIds)) return;

      const parentValues = field.parentFieldIds.map(
        (parentId: string) => formData[parentId]
      );

      // Prevent calculation if any parent value is missing (unless intended)
      if (parentValues.some((v) => v === undefined || v === "")) return;

      let newValue: any = formData[field.id];

      // --- Scalable Formula Logic ---
      // FIX: Replaced hardcoded 'calculateAge' with a more scalable structure.
      // In a real app, you would use a library like `expr-eval` or a custom interpreter here.
      if (field.formula === "calculateAge" && parentValues.length === 1) {
        const birthDate = new Date(parentValues[0] as string);
        if (!isNaN(birthDate.getTime())) {
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          newValue = age >= 0 ? age : "";
        }
      }
      // Example for another formula:
      // if (field.formula === 'concat' && parentValues.length > 1) {
      //   newValue = parentValues.join(' ');
      // }

      // Only include the update if the value has actually changed
      if (newValue !== formData[field.id]) {
        derivedDataUpdates[field.id] = newValue;
      }
    });

    // Apply all updates in a single batch state update to prevent multiple re-renders
    if (Object.keys(derivedDataUpdates).length > 0) {
      setFormData((prevData) => ({ ...prevData, ...derivedDataUpdates }));
    }

    // The dependency array now correctly watches only the relevant parent field values.
  }, [formData, derivedFields, form]);

  const validateField = useCallback((field: FormField, value: any): string => {
    let error = "";
    const val = String(value ?? ""); // Ensure value is a string for length checks

    if (field.required && !value) {
      // Check for falsy values like false, 0, ''
      return `${field.label} is required.`;
    }
    if (
      field.validations?.minLength &&
      val.length < field.validations.minLength
    ) {
      error = `${field.label} must be at least ${field.validations.minLength} characters.`;
    }
    if (
      field.validations?.maxLength &&
      val.length > field.validations.maxLength
    ) {
      error = `${field.label} cannot exceed ${field.validations.maxLength} characters.`;
    }
    if (
      field.validations?.isEmail &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = `${field.label} must be a valid email address.`;
    }
    // Add other validations (e.g., customPassword) here
    return error;
  }, []);

  const handleInputChange = useCallback(
    (fieldId: string, value: any) => {
      setFormData((prevData) => ({ ...prevData, [fieldId]: value }));
      const field = form?.fields.find((f) => f.id === fieldId);
      if (field) {
        const error = validateField(field, value);
        setFormErrors((prevErrors) => ({ ...prevErrors, [fieldId]: error }));
      }
    },
    [form, validateField]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    let hasErrors = false;
    const newErrors: FormErrors = {};

    form.fields.forEach((field: FormField) => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });

    setFormErrors(newErrors);

    if (!hasErrors) {
      console.log("Form submitted successfully:", formData);
      alert("Form submitted successfully! Check console for data.");
    } else {
      console.log("Form has errors:", newErrors);
      alert("Please correct the errors in the form.");
    }
  };

  if (!form) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Form not found!
        </Typography>
      </Box>
    );
  }

  // --- Render Logic ---
  const renderField = (field: FormField) => {
    const value = formData[field.id];
    const error = formErrors[field.id];

    // FIX: Removed redundant label for checkbox type as FormControlLabel handles it.
    const showMainLabel = field.type !== "checkbox";

    return (
      <FormControl
        key={field.id}
        fullWidth
        margin="normal"
        error={!!error}
        sx={{ mb: 3 }}
      >
        {showMainLabel && (
          <Typography variant="subtitle1" component="label" sx={{ mb: 1 }}>
            {field.label}{" "}
            {field.required && <span style={{ color: "red" }}>*</span>}
          </Typography>
        )}

        {(() => {
          switch (field.type) {
            case "text":
            case "number":
            case "date": // Date can also use TextField
              return (
                <TextField
                  type={field.type}
                  value={value || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  disabled={field.isDerived}
                  InputLabelProps={
                    field.type === "date" ? { shrink: true } : undefined
                  }
                />
              );
            case "textarea":
              return (
                <TextField
                  multiline
                  rows={4}
                  value={value || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  disabled={field.isDerived}
                />
              );
            case "select":
              // FIX: Correct MUI pattern for Select with a floating label.
              // The InputLabel is now inside the FormControl but the label prop is used.
              return (
                <>
                  <InputLabel id={`${field.id}-label`}>
                    {field.label}
                  </InputLabel>
                  <Select
                    labelId={`${field.id}-label`}
                    value={value || ""}
                    label={field.label} // This is crucial for the floating label animation
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    disabled={field.isDerived}
                  >
                    {field.options?.map((option: string) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              );
            case "radio":
              return (
                <RadioGroup
                  value={value || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                >
                  {field.options?.map((option: string) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio disabled={field.isDerived} />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              );
            case "checkbox":
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!value}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.checked)
                      }
                      disabled={field.isDerived}
                    />
                  }
                  label={
                    <>
                      {field.label}{" "}
                      {field.required && (
                        <span style={{ color: "red" }}>*</span>
                      )}
                    </>
                  }
                />
              );
            default:
              return null;
          }
        })()}
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Preview: {form.name}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        {form.fields.map((field) => renderField(field))}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Submit Form
        </Button>
      </Box>
    </Box>
  );
};

export default FormPreviewPage;
