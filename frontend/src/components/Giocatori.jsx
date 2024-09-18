// src/components/Giocatori.jsx

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';
import axios from 'axios';

function Giocatori() {
  const [giocatori, setGiocatori] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [nomeGiocatore, setNomeGiocatore] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: '',
  });

  useEffect(() => {
    fetchGiocatori();
  }, []);

  const fetchGiocatori = async () => {
    try {
      const response = await axios.get('/api/giocatori');
      setGiocatori(response.data);
    } catch (error) {
      console.error('Errore nel recupero dei giocatori:', error);
      setErrorSnackbar({ open: true, message: 'Errore nel recupero dei giocatori.' });
    }
  };

  const handleOpenDialog = () => {
    setNomeGiocatore('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAggiungiGiocatore = async () => {
    if (nomeGiocatore.trim() === '') {
      setErrorSnackbar({ open: true, message: 'Il nome del giocatore non può essere vuoto.' });
      return;
    }

    try {
      const payload = { nome: nomeGiocatore.trim() };
      const response = await axios.post('/api/giocatori', payload);
      setGiocatori([...giocatori, { id: response.data.id, nome: nomeGiocatore.trim() }]);
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      console.error('Errore durante l\'aggiunta del giocatore:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorSnackbar({ open: true, message: error.response.data.error });
      } else {
        setErrorSnackbar({ open: true, message: 'Errore durante l\'aggiunta del giocatore.' });
      }
    }
  };

  const handleDeleteGiocatore = async (giocatoreId) => {
    try {
      await axios.delete(`/api/giocatori/${giocatoreId}`);
      setGiocatori(giocatori.filter(g => g.id !== giocatoreId));
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Errore durante l\'eliminazione del giocatore:', error);
      setErrorSnackbar({ open: true, message: 'Errore durante l\'eliminazione del giocatore.' });
    }
  };

  return (
    <Paper sx={{ padding: 2, margin: 2 }}>
      <Typography variant="h5" gutterBottom>
        Lista Giocatori
      </Typography>
      
      {/* Pulsante per aggiungere un nuovo giocatore */}
      <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ marginBottom: 2 }}>
        Aggiungi Giocatore
      </Button>
      
      {/* Griglia di giocatori */}
      <Grid container spacing={2}>
        {giocatori.map((giocatore) => (
          <Grid item xs={12} sm={6} md={4} key={giocatore.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{giocatore.nome}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteGiocatore(giocatore.id)}
                >
                  Elimina
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog per aggiungere un nuovo giocatore */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Aggiungi Nuovo Giocatore</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome Giocatore"
            type="text"
            fullWidth
            variant="standard"
            value={nomeGiocatore}
            onChange={(e) => setNomeGiocatore(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button onClick={handleAggiungiGiocatore} variant="contained" color="primary">
            Aggiungi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar per notifiche di successo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Operazione completata con successo!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* Snackbar per notifiche di errore */}
      <Snackbar
        open={errorSnackbar.open}
        autoHideDuration={3000}
        onClose={() => setErrorSnackbar({ ...errorSnackbar, open: false })}
        message={errorSnackbar.message || "Si è verificato un errore."}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ color: 'error.main' }}
      />
    </Paper>
  );
}

export default Giocatori;
