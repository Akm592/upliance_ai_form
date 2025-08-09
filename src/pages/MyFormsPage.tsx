import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Button,
  Container,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import { useAppSelector } from "../app/hooks";
import type { FormSchema } from "../types";

const MyFormsPage: React.FC = () => {
  const savedForms = useAppSelector((state) => state.formBuilder.savedForms);

  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "grey.50",
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            mb: { xs: 3, md: 4 },
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.primary.main}05)`,
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
            size="large"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: 2,
              "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
              transition: "all 0.2s ease",
            }}
          >
            Create New Form
          </Button>
        </Paper>

        {/* Content */}
        {savedForms.length === 0 ? (
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              bgcolor: "background.paper",
              textAlign: "center",
              borderRadius: 3,
              p: { xs: 4, md: 6 },
              boxShadow: 1,
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                bgcolor: "primary.50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <DescriptionIcon sx={{ fontSize: 60, color: "primary.main" }} />
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
              size="large"
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: 2,
                "&:hover": { boxShadow: 4, transform: "translateY(-1px)" },
                transition: "all 0.2s ease",
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
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {savedForms.map((form: FormSchema, index: number) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={form.id || `form-${index}`}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "grey.200",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: 4,
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, pb: 1 }}>
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
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Stack direction="row" spacing={1} width="100%">
                        <Button
                          variant="outlined"
                          component={Link}
                          to={`/preview/${form.id}`}
                          startIcon={<VisibilityIcon />}
                          size="small"
                          sx={{
                            flex: 1,
                            textTransform: "none",
                            fontWeight: 500,
                            borderRadius: 1.5,
                          }}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="contained"
                          component={Link}
                          to={`/edit/${form.id}`}
                          startIcon={<EditIcon />}
                          size="small"
                          sx={{
                            flex: 1,
                            textTransform: "none",
                            fontWeight: 500,
                            borderRadius: 1.5,
                          }}
                        >
                          Edit
                        </Button>
                      </Stack>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default MyFormsPage;
