// src/components/Giocatori.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Snackbar,
} from '@mui/material';

function Giocatori() {
  const [giocatori, setGiocatori] = useState([]);
  const [nome, setNome] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchGiocatori();
  }, []);

  const fetchGiocatori = async () => {
    try {
      const response = await axios.get('/api/giocatori');
      setGiocatori(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const aggiungiGiocatore = async () => {
    if (nome.trim() === '') return;
    try {
      await axios.post('/api/giocatori', { nome });
      setNome('');
      fetchGiocatori();
      setOpenSnackbar(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Giocatori
      </Typography>
      <Grid container spacing={2}>
        {giocatori.map((giocatore) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={giocatore.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{giocatore.nome}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
        <TextField
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={aggiungiGiocatore}
          sx={{ marginLeft: 1 }}
        >
          Aggiungi
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Giocatore aggiunto con successo!"
      />
    </Paper>
  );
}

export default Giocatori;
