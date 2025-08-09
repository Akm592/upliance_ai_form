// src/components/FieldConfigPanel.tsx
import React from 'react';
import { Box, Typography, TextField, FormControlLabel, Switch, Select, MenuItem, InputLabel, FormControl, Chip, OutlinedInput } from '@mui/material'; // Removed Button
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { updateField, setSelectedField } from '../features/formBuilder/formBuilderSlice';
import type { FormField, FieldType } from '../types'; // Use type import

const FieldConfigPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedFieldId = useAppSelector((state) => state.formBuilder.selectedFieldId);
  const currentForm = useAppSelector((state) => state.formBuilder.currentForm);

  const selectedField = selectedFieldId
    ? currentForm.fields.find((field: FormField) => field.id === selectedFieldId) // Explicitly type field
    : null;

  const handleUpdateField = (updates: Partial<FormField>) => {
    if (selectedFieldId) {
      dispatch(updateField({ fieldId: selectedFieldId, updates }));
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdateField({ label: e.target.value });
  };

  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdateField({ required: e.target.checked });
  };

  const handleMinLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdateField({ validations: { ...selectedField?.validations, minLength: Number(e.target.value) } });
  };

  const handleMaxLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdateField({ validations: { ...selectedField?.validations, maxLength: Number(e.target.value) } });
  };

  const handleOptionsChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown; }>) => {
    const { value } = event.target;
    handleUpdateField({
      options: typeof value === 'string' ? value.split(',') : value as string[],
    });
  };

  const handleIsDerivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdateField({ isDerived: e.target.checked });
  };

  const handleParentFieldIdsChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown; }>) => {
    const { value } = event.target;
    handleUpdateField({
      parentFieldIds: typeof value === 'string' ? value.split(',') : value as string[],
    });
  };

  const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdateField({ formula: e.target.value });
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

  const availableParentFields = currentForm.fields.filter((f: FormField) => f.id !== selectedField.id); // Explicitly type f

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Field: {selectedField.label}</Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Type: {selectedField.type}</Typography>

      <TextField
        label="Label"
        value={selectedField.label}
        onChange={handleLabelChange}
        fullWidth
        margin="normal"
      />

      <FormControlLabel
        control={
          <Switch
            checked={selectedField.required}
            onChange={handleRequiredChange}
            name="required"
          />
        }
        label="Required"
      />

      {(selectedField.type === 'text' || selectedField.type === 'textarea') && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Validations</Typography>
          <TextField
            label="Min Length"
            type="number"
            value={selectedField.validations?.minLength || ''}
            onChange={handleMinLengthChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Max Length"
            type="number"
            value={selectedField.validations?.maxLength || ''}
            onChange={handleMaxLengthChange}
            fullWidth
            margin="normal"
          />
        </Box>
      )}

      {(selectedField.type === 'select' || selectedField.type === 'radio') && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="options-label">Options</InputLabel>
          <Select
            labelId="options-label"
            multiple
            value={selectedField.options || []}
            onChange={handleOptionsChange}
            input={<OutlinedInput id="select-multiple-chip" label="Options" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {/* For now, let's assume options are manually entered as comma-separated string */}
            {/* In a real app, you might have a more sophisticated way to add/edit options */}
            <MenuItem disabled value="">Enter options as comma-separated values in the text field below</MenuItem>
          </Select>
          <TextField
            label="Enter Options (comma-separated)"
            value={selectedField.options?.join(',') || ''}
            onChange={handleOptionsChange}
            fullWidth
            margin="normal"
            helperText="e.g., Option1,Option2,Option3"
          />
        </FormControl>
      )}

      <Box sx={{ mt: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={selectedField.isDerived || false}
              onChange={handleIsDerivedChange}
              name="isDerived"
            />
          }
          label="Is Derived Field"
        />
        {selectedField.isDerived && (
          <Box>
            <FormControl fullWidth margin="normal">
              <InputLabel id="parent-fields-label">Depends on Fields</InputLabel>
              <Select
                labelId="parent-fields-label"
                multiple
                value={selectedField.parentFieldIds || []}
                onChange={handleParentFieldIdsChange}
                input={<OutlinedInput id="select-multiple-parent-chip" label="Depends on Fields" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((fieldId) => {
                      const field = currentForm.fields.find((f: FormField) => f.id === fieldId);
                      return <Chip key={fieldId} label={field?.label || fieldId} />;
                    })}
                  </Box>
                )}
              >
                {availableParentFields.map((field: FormField) => ( // Explicitly type field
                  <MenuItem key={field.id} value={field.id}>
                    {field.label} ({field.type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Formula (e.g., calculateAge)"
              value={selectedField.formula || ''}
              onChange={handleFormulaChange}
              fullWidth
              margin="normal"
              helperText="Define the logic for this derived field."
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FieldConfigPanel;
