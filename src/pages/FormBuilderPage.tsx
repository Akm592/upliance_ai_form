// src/pages/FormBuilderPage.tsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Stack,
  Paper,
} from "@mui/material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";


import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  reorderFields,
  addField,
  setCurrentFormName,
  saveCurrentForm,
} from "../features/formBuilder/formBuilderSlice";
import type { FieldType } from "../types";
import SortableFormField from "../components/SortableFormField";
import FieldConfigPanel from "../components/FieldConfigPanel";

const FormBuilderPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentForm = useAppSelector((state) => state.formBuilder.currentForm);

  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [formNameInput, setFormNameInput] = useState(currentForm.name);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      dispatch(
        reorderFields({
          activeId: active.id.toString(),
          overId: over.id!.toString(),
        })
      );
    }
  };

  const handleAddField = (type: FieldType) => {
    dispatch(addField({ type }));
  };

  const handleOpenSaveDialog = () => {
    setFormNameInput(currentForm.name);
    setOpenSaveDialog(true);
  };

  const handleCloseSaveDialog = () => {
    setOpenSaveDialog(false);
  };

  const handleSaveForm = () => {
    dispatch(setCurrentFormName(formNameInput));
    dispatch(saveCurrentForm());
    handleCloseSaveDialog();
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          {currentForm.name}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenSaveDialog}
        >
          Save Form
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Form Canvas */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ border: "1px dashed grey", p: 2, minHeight: "400px" }}>
            <Typography variant="h6" gutterBottom>
              Form Fields
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
              <Button variant="outlined" onClick={() => handleAddField("text")}>
                Add Text
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleAddField("number")}
              >
                Add Number
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleAddField("textarea")}
              >
                Add Textarea
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleAddField("select")}
              >
                Add Select
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleAddField("radio")}
              >
                Add Radio
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleAddField("checkbox")}
              >
                Add Checkbox
              </Button>
              <Button variant="outlined" onClick={() => handleAddField("date")}>
                Add Date
              </Button>
            </Stack>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentForm.fields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                {currentForm.fields.length === 0 ? (
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ p: 2 }}
                  >
                    Drag and drop fields here, or use the buttons above to add
                    new fields.
                  </Typography>
                ) : (
                  currentForm.fields.map((field) => (
                    <SortableFormField key={field.id} field={field} />
                  ))
                )}
              </SortableContext>
            </DndContext>
          </Paper>
        </Grid>

        {/* Right Column: Field Configuration Panel */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, minHeight: "400px" }}>
            <Typography variant="h6" gutterBottom>
              Field Configuration
            </Typography>
            <FieldConfigPanel />
          </Paper>
        </Grid>
      </Grid>

      {/* Save Form Dialog */}
      <Dialog open={openSaveDialog} onClose={handleCloseSaveDialog}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your form.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="formName"
            label="Form Name"
            type="text"
            fullWidth
            variant="standard"
            value={formNameInput}
            onChange={(e) => setFormNameInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaveDialog}>Cancel</Button>
          <Button onClick={handleSaveForm} disabled={!formNameInput.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormBuilderPage;
