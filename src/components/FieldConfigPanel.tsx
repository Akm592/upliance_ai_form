import React from "react";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { updateField } from "../features/formBuilder/formBuilderSlice";
import type { FormField} from "../types";

const FieldConfigPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedFieldId = useAppSelector(
    (state) => state.formBuilder.selectedFieldId
  );
  const currentForm = useAppSelector((state) => state.formBuilder.currentForm);

  const selectedField = selectedFieldId
    ? currentForm.fields.find((field) => field.id === selectedFieldId)
    : null;

  const handleUpdateField = (updates: Partial<FormField>) => {
    if (selectedFieldId) {
      dispatch(updateField({ fieldId: selectedFieldId, updates }));
    }
  };

  if (!selectedField) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="textSecondary">
          Select a field on the left to configure its properties.
        </Typography>
      </Box>
    );
  }

  const availableParentFields = currentForm.fields.filter(
    (f) => f.id !== selectedField.id
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Field: {selectedField.label || "(No label)"}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Type: {selectedField.type}
      </Typography>

      {/* Label */}
      <TextField
        label="Label"
        value={selectedField.label}
        onChange={(e) => handleUpdateField({ label: e.target.value })}
        fullWidth
        margin="normal"
      />

      {/* Required */}
      <FormControlLabel
        control={
          <Switch
            checked={selectedField.required || false}
            onChange={(e) => handleUpdateField({ required: e.target.checked })}
          />
        }
        label="Required"
      />

      {/* Default Value */}
      <TextField
        label="Default Value"
        value={selectedField.defaultValue || ""}
        onChange={(e) => handleUpdateField({ defaultValue: e.target.value })}
        fullWidth
        margin="normal"
      />

      {/* Validation Rules */}
      {(selectedField.type === "text" ||
        selectedField.type === "textarea" ||
        selectedField.type === "number" ||
        selectedField.type === "password" ||
        selectedField.type === "email") && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Validations</Typography>
          {(selectedField.type === "text" ||
            selectedField.type === "textarea" ||
            selectedField.type === "password") && (
            <>
              <TextField
                label="Min Length"
                type="number"
                value={selectedField.validations?.minLength || ""}
                onChange={(e) =>
                  handleUpdateField({
                    validations: {
                      ...selectedField.validations,
                      minLength: Number(e.target.value) || undefined,
                    },
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Max Length"
                type="number"
                value={selectedField.validations?.maxLength || ""}
                onChange={(e) =>
                  handleUpdateField({
                    validations: {
                      ...selectedField.validations,
                      maxLength: Number(e.target.value) || undefined,
                    },
                  })
                }
                fullWidth
                margin="normal"
              />
            </>
          )}

          {selectedField.type === "email" && (
            <FormControlLabel
              control={
                <Switch
                  checked={selectedField.validations?.isEmail || false}
                  onChange={(e) =>
                    handleUpdateField({
                      validations: {
                        ...selectedField.validations,
                        isEmail: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Must be a valid email address"
            />
          )}

          {selectedField.type === "password" && (
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={
                      selectedField.validations?.mustContainNumber || false
                    }
                    onChange={(e) =>
                      handleUpdateField({
                        validations: {
                          ...selectedField.validations,
                          mustContainNumber: e.target.checked,
                        },
                      })
                    }
                  />
                }
                label="Must contain a number"
              />
              <TextField
                label="Min Password Length"
                type="number"
                value={selectedField.validations?.minLength || ""}
                onChange={(e) =>
                  handleUpdateField({
                    validations: {
                      ...selectedField.validations,
                      minLength: Number(e.target.value) || undefined,
                    },
                  })
                }
                fullWidth
                margin="normal"
              />
            </>
          )}
        </Box>
      )}

      {/* Options for Select/Radio */}
      {(selectedField.type === "select" || selectedField.type === "radio") && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="options-label">Options</InputLabel>
          <Select
            labelId="options-label"
            multiple
            value={selectedField.options || []}
            onChange={(e) =>
              handleUpdateField({
                options:
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : (e.target.value as string[]),
              })
            }
            input={<OutlinedInput id="select-multiple-chip" label="Options" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            <MenuItem disabled value="">
              Enter options below as comma-separated
            </MenuItem>
          </Select>
          <TextField
            label="Enter Options (comma-separated)"
            value={selectedField.options?.join(",") || ""}
            onChange={(e) =>
              handleUpdateField({
                options: e.target.value.split(",").map((opt) => opt.trim()),
              })
            }
            fullWidth
            margin="normal"
          />
        </FormControl>
      )}

      {/* Derived Field Settings */}
      <Box sx={{ mt: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={selectedField.isDerived || false}
              onChange={(e) =>
                handleUpdateField({ isDerived: e.target.checked })
              }
            />
          }
          label="Is Derived Field"
        />
        {selectedField.isDerived && (
          <Box>
            <FormControl fullWidth margin="normal">
              <InputLabel id="parent-fields-label">
                Depends on Fields
              </InputLabel>
              <Select
                labelId="parent-fields-label"
                multiple
                value={selectedField.parentFieldIds || []}
                onChange={(e) =>
                  handleUpdateField({
                    parentFieldIds:
                      typeof e.target.value === "string"
                        ? e.target.value.split(",")
                        : (e.target.value as string[]),
                  })
                }
                input={
                  <OutlinedInput
                    id="select-multiple-parent-chip"
                    label="Depends on Fields"
                  />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((fieldId) => {
                      const field = currentForm.fields.find(
                        (f) => f.id === fieldId
                      );
                      return (
                        <Chip key={fieldId} label={field?.label || fieldId} />
                      );
                    })}
                  </Box>
                )}
              >
                {availableParentFields.map((field) => (
                  <MenuItem key={field.id} value={field.id}>
                    {field.label} ({field.type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Formula (JavaScript Expression)"
              value={selectedField.formula || ""}
              onChange={(e) => handleUpdateField({ formula: e.target.value })}
              fullWidth
              margin="normal"
              helperText="Use parent field values to compute this field's value."
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FieldConfigPanel;
