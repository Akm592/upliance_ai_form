import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'; // Added Box
import MyFormsPage from './pages/MyFormsPage';
import FormBuilderPage from './pages/FormBuilderPage';
import FormPreviewPage from './pages/FormPreviewPage';
import { useEffect } from 'react';
import { useAppDispatch } from './app/hooks';
import { loadForms } from './features/formBuilder/formBuilderSlice';
import { loadFormsFromStorage } from './services/storage';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedForms = loadFormsFromStorage();
    if (storedForms.length > 0) {
      dispatch(loadForms(storedForms));
    }
  }, [dispatch]);

  return (
    <Router>
      <AppBar position="static" color="primary" elevation={0}> {/* Added color and elevation */}
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}> {/* Added fontWeight */}
            Upliance Form Builder
          </Typography>
          <Button color="inherit" component={Link} to="/myforms" sx={{ mx: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}> {/* Added mx and hover style */}
            My Forms
          </Button>
          <Button variant="contained" color="secondary" component={Link} to="/create" sx={{ ml: 1 }}> {/* Changed to contained, secondary color */}
            Create New Form
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> {/* Added maxWidth and mb */}
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