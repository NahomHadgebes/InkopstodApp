import { useState } from 'react';
import axios from 'axios';
import { 
  Box, Paper, TextField, Button, Typography, Container, Alert 
} from '@mui/material';

// Vi tar emot 'children' här – det är där din Logo från App.jsx hamnar!
const Login = ({ onLogin, children }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('https://localhost:7027/api/Auth/login', {
        username,
        password
      });
      onLogin(response.data);
    } catch (err) {
      setError('Fel användarnamn eller lösenord. Försök igen.');
      console.error("Inloggningsfel:", err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
          
          {/* HÄR HAMNAR LOGGAN NU ISTÄLLET FÖR LÅSET */}
          <Box sx={{ mb: 2 }}>
            {children}
          </Box>

          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Logga in i Inköpsstöd
          </Typography>
          
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Användarnamn"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Lösenord"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
            >
              LOGGA IN
            </Button>
            <Typography variant="body2" color="text.secondary" align="center">
              Kontakta administratör om du saknar konto.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;