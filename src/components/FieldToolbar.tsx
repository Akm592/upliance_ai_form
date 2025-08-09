import React from "react";
import { Box, Button, Stack, Tooltip } from "@mui/material";
import type { FieldType } from "../types";

interface FieldToolbarProps {
  onAddField: (type: FieldType) => void;
}

const FieldToolbar: React.FC<FieldToolbarProps> = ({ onAddField }) => {
  const fieldButtons: { label: string; type: FieldType; tooltip?: string }[] = [
    { label: "Text", type: "text", tooltip: "Single-line text input" },
    { label: "Number", type: "number", tooltip: "Numeric input" },
    { label: "Textarea", type: "textarea", tooltip: "Multi-line text input" },
    { label: "Select", type: "select", tooltip: "Dropdown with options" },
    { label: "Radio", type: "radio", tooltip: "Single-choice radio buttons" },
    {
      label: "Checkbox",
      type: "checkbox",
      tooltip: "Multiple choice checkboxes",
    },
    { label: "Date", type: "date", tooltip: "Date picker" },
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {fieldButtons.map((btn) => (
          <Tooltip key={btn.type} title={btn.tooltip || btn.label}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onAddField(btn.type)}
            >
              Add {btn.label}
            </Button>
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
};

export default FieldToolbar;
