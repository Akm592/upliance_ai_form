import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MyFormsPage from "./pages/MyFormsPage";
import FormBuilderPage from "./pages/FormBuilderPage";
import FormPreviewPage from "./pages/FormPreviewPage";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { loadForms } from "./features/formBuilder/formBuilderSlice";
import { loadFormsFromStorage } from "./services/storage";

function App() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // mobile <600px
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl")); // very large screens

  useEffect(() => {
    const storedForms = loadFormsFromStorage();
    if (storedForms.length > 0) {
      dispatch(loadForms(storedForms));
    }
  }, [dispatch]);

  return (
    <Router>
      {/* AppBar */}
      <AppBar
        position="static"
        color="primary"
        elevation={0}
        sx={{
          width: "100vw", // Full viewport width
          left: 0,
          right: 0,
          boxSizing: "border-box",
        }}
      >
        {/* Center content with responsive max-width */}
        <Toolbar
          sx={{
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: isMobile ? 1.5 : 0,
            py: isMobile ? 1.5 : 0,
            width: "100%",
            maxWidth: "1440px", // Keeps content centered on ultrawide
            mx: "auto", // Centers horizontally
            px: isMobile ? 2 : 4, // Side padding
          }}
        >
          {/* Title */}
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            Upliance Form Builder
          </Typography>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 1 : 2,
              width: isMobile ? "100%" : "auto",
            }}
          >
            <Button
              color="inherit"
              component={Link}
              to="/myforms"
              sx={{
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                width: isMobile ? "100%" : "auto",
              }}
            >
              My Forms
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/create"
              sx={{
                width: isMobile ? "100%" : "auto",
              }}
            >
              Create New Form
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container
        maxWidth={false}
        sx={{
          mt: 4,
          mb: 4,
          px: isMobile ? 2 : 3,
        }}
      >
        <Routes>
          <Route path="/" element={<MyFormsPage />} />
          <Route path="/myforms" element={<MyFormsPage />} />
          <Route path="/create" element={<FormBuilderPage />} />
          <Route path="/preview/:formId" element={<FormPreviewPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
