import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import type { FormEvent } from "react";
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
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useAppSelector } from "../app/hooks";
import type { FormField } from "../types";

interface FormData {
  [key: string]: string | number | boolean | undefined;
}
interface FormErrors {
  [key: string]: string;
}
interface SubmissionStatus {
  type: "success" | "error";
  message: string;
}

const calculateDerivedValue = (
  formula: string,
  parentValues: (string | number | boolean | undefined)[]
) => {
  if (formula === "calculateAge" && parentValues.length === 1) {
    const birthDate = new Date(parentValues[0] as string);
    if (isNaN(birthDate.getTime())) return "";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age >= 0 ? age : "";
  }
  return "";
};

const FormPreviewPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const savedForms = useAppSelector((state) => state.formBuilder.savedForms);

  const [formData, setFormData] = useState<FormData>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus | null>(null);

  const form = useMemo(
    () => savedForms.find((f) => f.id === formId),
    [savedForms, formId]
  );

  const parentToDerivedMap = useMemo(() => {
    const map = new Map<string, FormField[]>();
    if (!form) return map;
    form.fields
      .filter((field) => field.isDerived)
      .forEach((derivedField) => {
        derivedField.parentFieldIds?.forEach((parentId) => {
          const children = map.get(parentId) || [];
          children.push(derivedField);
          map.set(parentId, children);
        });
      });
    return map;
  }, [form]);

  useEffect(() => {
    if (form) {
      setIsLoading(true);
      const initialData: FormData = {};
      const initialErrors: FormErrors = {};
      form.fields.forEach((field) => {
        initialData[field.id] =
          field.defaultValue ?? (field.type === "checkbox" ? false : "");
        initialErrors[field.id] = "";
      });
      form.fields
        .filter((field) => field.isDerived)
        .forEach((derivedField) => {
          if (derivedField.formula && derivedField.parentFieldIds) {
            const parentValues = derivedField.parentFieldIds.map(
              (id) => initialData[id]
            );
            if (parentValues.every((v) => v !== "" && v !== undefined)) {
              initialData[derivedField.id] = calculateDerivedValue(
                derivedField.formula,
                parentValues
              );
            }
          }
        });
      setFormData(initialData);
      setFormErrors(initialErrors);
      setIsLoading(false);
    }
  }, [form]);

  const validateField = useCallback(
    (field: FormField, value: string | number | boolean | undefined): string => {
    if (
      field.required &&
      (value === "" || value === false || value === undefined)
    ) {
      return `${field.label} is required.`;
    }
    const stringValue = String(value ?? "");
    if (
      field.validations?.minLength &&
      stringValue.length < field.validations.minLength
    ) {
      return `${field.label} must be at least ${field.validations.minLength} characters.`;
    }
    if (
      field.validations?.maxLength &&
      stringValue.length > field.validations.maxLength
    ) {
      return `${field.label} cannot exceed ${field.validations.maxLength} characters.`;
    }
    if (
      field.validations?.isEmail &&
      stringValue &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)
    ) {
      return `Please enter a valid email address.`;
    }
    return "";
  }, []);

  const handleInputChange = useCallback(
      (fieldId: string, value: string | number | boolean) => {
      setSubmissionStatus(null);
      const newFormData = { ...formData, [fieldId]: value };
      const derivedChildren = parentToDerivedMap.get(fieldId);
      if (derivedChildren) {
        derivedChildren.forEach((child) => {
          if (child.formula && child.parentFieldIds) {
            const parentValues = child.parentFieldIds.map(
              (id) => newFormData[id]
            );
            newFormData[child.id] = calculateDerivedValue(
              child.formula,
              parentValues
            );
          }
        });
      }
      setFormData(newFormData);
      const field = form?.fields.find((f) => f.id === fieldId);
      if (field) {
        setFormErrors((prev) => ({
          ...prev,
          [fieldId]: validateField(field, value),
        }));
      }
    },
    [formData, form, parentToDerivedMap, validateField]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    let hasErrors = false;
    const newErrors: FormErrors = {};
    form.fields.forEach((field) => {
      if (field.isDerived) return;
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });
    setFormErrors(newErrors);
    if (!hasErrors) {
      console.log("Form submitted successfully:", formData);
      setSubmissionStatus({
        type: "success",
        message: "Form submitted successfully!",
      });
    } else {
      setSubmissionStatus({
        type: "error",
        message: "Please correct the errors highlighted in the form.",
      });
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!form) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Form not found!
        </Typography>
      </Box>
    );
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id];
    const error = formErrors[field.id];
    const commonProps = {
      value: value || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleInputChange(field.id, e.target.value),
      disabled: field.isDerived,
      fullWidth: true,
      variant: "outlined" as const,
    };

    let inputElement;
    switch (field.type) {
      case "text":
      case "number":
        inputElement = <TextField type={field.type} {...commonProps} />;
        break;
      case "date":
        inputElement = (
          <TextField
            type="date"
            InputLabelProps={{ shrink: true }}
            {...commonProps}
          />
        );
        break;
      case "textarea":
        inputElement = <TextField multiline rows={4} {...commonProps} />;
        break;
      case "select":
        inputElement = (
          <FormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              disabled={field.isDerived}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        break;
      case "radio":
        inputElement = (
          <RadioGroup
            value={value || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          >
            {field.options?.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio disabled={field.isDerived} />}
                label={option}
              />
            ))}
          </RadioGroup>
        );
        break;
      case "checkbox":
        inputElement = (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => handleInputChange(field.id, e.target.checked)}
                disabled={field.isDerived}
              />
            }
            label={field.label}
          />
        );
        break;
    }

    return (
      <Box key={field.id} sx={{ mb: 3 }}>
        {field.type !== "select" &&
          field.type !== "checkbox" &&
          field.type !== "radio" && (
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              {field.required && <span className="required-asterisk">*</span>}
              {field.required && <span className="required-asterisk">*</span>}
            </Typography>
          )}
        {inputElement}
        {error && <FormHelperText error>{error}</FormHelperText>}
        <Divider sx={{ mt: 2 }} />
      </Box>
    );
  };

  return (
    <Box sx={{ bgcolor: "#f7f7fb", py: 4, minHeight: "100vh" }}>
      <Box sx={{ bgcolor: "primary.main", height: "6px", mb: 3 }} />
      <Box
        sx={{
          maxWidth: 640,
          mx: "auto",
          bgcolor: "white",
          borderRadius: 2,
          p: { xs: 2, sm: 4 },
          boxShadow: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          {form.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Please fill out the form below. Required fields are marked with (*).
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          {form.fields.map((field) => renderField(field))}
          {submissionStatus && (
            <Alert severity={submissionStatus.type} sx={{ mb: 2 }}>
              {submissionStatus.message}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default FormPreviewPage;
