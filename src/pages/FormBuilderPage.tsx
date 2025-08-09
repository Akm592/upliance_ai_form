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
  CircularProgress,
  Alert,
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

const SortableContext = DndSortableContext as unknown as React.FC<
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
  const [formNameInput, setFormNameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load form on mount
  useEffect(() => {
    const loadForm = async () => {
      try {
        setIsLoading(true);
        if (formId) {
          await dispatch(loadFormForEdit(formId));
        } else {
          dispatch(resetCurrentForm());
        }
      } catch {
        setError("Failed to load form.");
      } finally {
        setIsLoading(false);
      }
    };
    loadForm();
  }, [dispatch, formId]);

  // Only set name initially (avoid overwriting unsaved changes)
  useEffect(() => {
    if (!formNameInput && currentForm.name) {
      setFormNameInput(currentForm.name);
    }
  }, [currentForm.name, formNameInput]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;
      if (active.id !== over.id) {
        dispatch(
          reorderFields({
            activeId: String(active.id),
            overId: String(over.id),
          })
        );
      }
    },
    [dispatch]
  );

  const handleAddField = useCallback(
    (type: FieldType) => {
      if (!type) return;
      dispatch(addField({ type }));
    },
    [dispatch]
  );

  const handleSaveForm = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);
      dispatch(setCurrentFormName(formNameInput.trim()));
      await dispatch(saveCurrentForm());
      setOpenSaveDialog(false);
    } catch {
      setError("Failed to save form.");
    } finally {
      setIsSaving(false);
    }
  }, [dispatch, formNameInput]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        bgcolor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ wordBreak: "break-word" }}
        >
          {currentForm.name || "Untitled Form"}
        </Typography>
        <Button
          variant="contained"
          size="medium"
          sx={{ borderRadius: 2, px: 3 }}
          onClick={() => {
            setFormNameInput(currentForm.name);
            setOpenSaveDialog(true);
          }}
        >
          Save Form
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <GridLegacy container spacing={3}>
          {/* Form Canvas */}
          <GridLegacy  item xs={12} md={7}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: 3,
                p: 2,
                minHeight: "70vh",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h6" fontWeight="medium">
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
                      color="text.secondary"
                      sx={{
                        p: 3,
                        textAlign: "center",
                        bgcolor: "#f3f4f6",
                        borderRadius: 2,
                      }}
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
          <GridLegacy item xs={12} md={5}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                minHeight: "70vh",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h6" fontWeight="medium">
                Field Configuration
              </Typography>
              <FieldConfigPanel />
            </Paper>
          </GridLegacy>
        </GridLegacy>
      )}

      {/* Save Dialog */}
      <Dialog
        open={openSaveDialog}
        onClose={() => setOpenSaveDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter a name for your form:
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            value={formNameInput}
            onChange={(e) => setFormNameInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenSaveDialog(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ borderRadius: 2 }}
            onClick={handleSaveForm}
            disabled={!formNameInput.trim() || isSaving}
          >
            {isSaving ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormBuilderPage;
