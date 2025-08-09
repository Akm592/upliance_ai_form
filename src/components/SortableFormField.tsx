// src/components/SortableFormField.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Box, Typography, IconButton, Stack } from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import type { FormField } from "../types";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  deleteField,
  setSelectedField,
} from "../features/formBuilder/formBuilderSlice";

interface SortableFormFieldProps {
  field: FormField;
}

const SortableFormField: React.FC<SortableFormFieldProps> = ({ field }) => {
  const dispatch = useAppDispatch();
  const selectedFieldId = useAppSelector(
    (state) => state.formBuilder.selectedFieldId
  );

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    dispatch(deleteField({ fieldId: field.id }));
  };

  const handleEdit = () => {
    dispatch(setSelectedField(field.id));
  };

  const isSelected = selectedFieldId === field.id;

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        p: 2,
        mb: 1,
        border: isSelected ? "2px solid" : "1px solid",
        borderColor: isSelected ? "primary.main" : "grey.300",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: isSelected ? "primary.light" : "background.paper",
        boxShadow: isSelected ? 3 : 1,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
        },
      }}
      {...attributes}
      onClick={handleEdit}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton {...listeners} sx={{ cursor: "grab", p: 0.5 }}>
          <DragHandleIcon sx={{ color: "grey.500" }} />
        </IconButton>
        <Typography variant="body1" sx={{ flexGrow: 1 }}>
          {field.label} ({field.type})
        </Typography>
      </Stack>

      <Stack direction="row" spacing={0.5}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default SortableFormField;
