import { createTheme, alpha } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4f46e5", // Indigo
      contrastText: "#fff",
    },
    secondary: {
      main: "#ec4899", // Pink
    },
    background: {
      default: "#f9fafb",
      paper: alpha("#ffffff", 0.85), // Glass effect
    },
    text: {
      primary: "#1f2937",
      secondary: "#4b5563",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    h6: { fontWeight: 600 },
    h4: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)`,
          minHeight: "100vh",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.2)",
        },
      },
    },
  },
});
