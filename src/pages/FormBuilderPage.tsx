// src/pages/FormBuilderPage.tsx
import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  GridLegacy,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Paper,
} from "@mui/material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext as DndSortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { SortingStrategy } from "@dnd-kit/sortable";
import type { UniqueIdentifier } from "@dnd-kit/core";

// Workaround to satisfy TS that SortableContext returns ReactNode
const SortableContext = (DndSortableContext as unknown) as React.FC<
  React.PropsWithChildren<{
    items: UniqueIdentifier[];
    strategy: SortingStrategy;
    disabled?: boolean;
    id?: string;
  }>
>;

import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  reorderFields,
  addField,
  setCurrentFormName,
  saveCurrentForm,
  loadFormForEdit,
  resetCurrentForm,
} from "../features/formBuilder/formBuilderSlice";
import type { FieldType } from "../types";

import SortableFormField from "../components/SortableFormField";
import FieldConfigPanel from "../components/FieldConfigPanel";
import FieldToolbar from "../components/FieldToolbar";

const FormBuilderPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { formId } = useParams<{ formId: string }>();
  const currentForm = useAppSelector((state) => state.formBuilder.currentForm);

  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [formNameInput, setFormNameInput] = useState(currentForm.name);

  useEffect(() => {
    if (formId) {
      dispatch(loadFormForEdit(formId));
    } else {
      dispatch(resetCurrentForm());
    }
  }, [dispatch, formId]);

  useEffect(() => {
    setFormNameInput(currentForm.name);
  }, [currentForm.name]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        dispatch(
          reorderFields({
            activeId: active.id.toString(),
            overId: over.id!.toString(),
          })
        );
      }
    },
    [dispatch]
  );

  const handleAddField = useCallback(
    (type: FieldType) => {
      dispatch(addField({ type }));
    },
    [dispatch]
  );

  const handleSaveForm = useCallback(() => {
    dispatch(setCurrentFormName(formNameInput.trim()));
    dispatch(saveCurrentForm());
    setOpenSaveDialog(false);
  }, [dispatch, formNameInput]);

  return (
    <Box sx={{ flexGrow: 1, p: 3, height: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">
          {currentForm.name || "Untitled Form"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setFormNameInput(currentForm.name);
            setOpenSaveDialog(true);
          }}
        >
          Save Form
        </Button>
      </Box>

      <GridLegacy container spacing={3}>
        {/* Form Canvas */}
        <GridLegacy item xs={12} md={7}>
          <Paper sx={{ border: "1px dashed grey", p: 2, minHeight: "70vh" }}>
            <Typography variant="h6" gutterBottom>
              Form Fields
            </Typography>
            <FieldToolbar onAddField={handleAddField} />

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentForm.fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                {currentForm.fields.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ p: 2 }}
                  >
                    Use the buttons above to add fields or drag them here.
                  </Typography>
                ) : (
                  currentForm.fields.map((field) => (
                    <SortableFormField key={field.id} field={field} />
                  ))
                )}
              </SortableContext>
            </DndContext>
          </Paper>
        </GridLegacy>

        {/* Config Panel */}
        <GridLegacy   item xs={12} md={5}>
          <Paper sx={{ p: 2, minHeight: "70vh" }}>
            <Typography variant="h6">Field Configuration</Typography>
            <FieldConfigPanel />
          </Paper>
        </GridLegacy>
      </GridLegacy>

      {/* Save Dialog */}
      <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter a name for your form:</DialogContentText>
          <TextField
            autoFocus
            fullWidth
            variant="standard"
            value={formNameInput}
            onChange={(e) => setFormNameInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} disabled={!formNameInput.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormBuilderPage;
