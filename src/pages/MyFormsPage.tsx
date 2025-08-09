import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Container,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Grid,
  GridLegacy,

  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { deleteForm } from "../features/formBuilder/formBuilderSlice";
import type { FormSchema } from "../types";

const MyFormsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const savedForms = useAppSelector((state) => state.formBuilder.savedForms);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (formId: string) => {
    setSelectedFormId(formId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedFormId) dispatch(deleteForm(selectedFormId));
    setSelectedFormId(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setSelectedFormId(null);
    setDeleteDialogOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.50",
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            mb: { xs: 3, md: 4 },
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.primary.light}05)`,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            boxShadow: 1,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                mb: 0.5,
              }}
            >
              My Forms
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and organize all your created forms
            </Typography>
          </Box>
          <Button
            variant="contained"
            component={Link}
            to="/create"
            startIcon={<AddCircleOutlineIcon />}
            size={isMobile ? "medium" : "large"}
            sx={{
              borderRadius: 2,
              px: { xs: 2, sm: 3 },
              py: 1.5,
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: 2,
              "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
              transition: "all 0.2s ease",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Create New Form
          </Button>
        </Paper>

        {/* Empty State */}
        {savedForms.length === 0 ? (
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              textAlign: "center",
              borderRadius: 3,
              p: { xs: 3, md: 6 },
              boxShadow: 1,
            }}
          >
            <Box
              sx={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                bgcolor: "primary.50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <DescriptionIcon sx={{ fontSize: 54, color: "primary.main" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                mb: 1,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
              }}
            >
              No forms created yet
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 500 }}
            >
              Get started by creating your first form. Build surveys,
              questionnaires, and data collection forms with ease.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/create"
              startIcon={<AddCircleOutlineIcon />}
              size={isMobile ? "medium" : "large"}
              sx={{
                borderRadius: 2,
                px: { xs: 3, sm: 4 },
                py: 1.5,
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1.05rem",
                boxShadow: 2,
                "&:hover": { boxShadow: 4, transform: "translateY(-1px)" },
                transition: "all 0.2s ease",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Create Your First Form
            </Button>
          </Paper>
        ) : (
          <>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {savedForms.length} form{savedForms.length !== 1 ? "s" : ""} found
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {savedForms.map((form: FormSchema) => (
                <GridLegacy item xs={12} sm={6} md={4} lg={3} key={form.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "grey.200",
                      transition: "all 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: 4,
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                              mb: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              lineHeight: 1.2,
                              minHeight: "2.4em",
                            }}
                          >
                            {form.name}
                          </Typography>
                          <Chip
                            label="Active"
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ fontSize: "0.75rem" }}
                          />
                        </Box>
                        <Divider />
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            Created
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            {new Date(form.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/preview/${form.id}`)}
                      >
                        Preview
                      </Button>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/edit/${form.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(form.id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </GridLegacy>
              ))}
            </Grid>

            {/* Delete Confirmation */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
              <DialogTitle>Delete Form</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this form? This action cannot
                  be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteCancel}>Cancel</Button>
                <Button onClick={handleDeleteConfirm} color="error">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Container>
    </Box>
  );
};

export default MyFormsPage;
