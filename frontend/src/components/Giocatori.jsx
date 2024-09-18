// src/components/Giocatori.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

function Giocatori() {
  const [giocatori, setGiocatori] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedGiocatore, setSelectedGiocatore] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);

  useEffect(() => {
    fetchGiocatori();
  }, []);

  const fetchGiocatori = async () => {
    try {
      const response = await axios.get('/api/giocatori');
      setGiocatori(response.data);
    } catch (error) {
      console.error('Errore nel recupero dei giocatori:', error);
      setErrorSnackbar(true);
    }
  };

  const handleEliminaGiocatore = async () => {
    if (selectedGiocatore) {
      try {
        await axios.delete(`/api/giocatori/${selectedGiocatore}`);
        setOpenSnackbar(true);
        fetchGiocatori(); // Ricarica la lista dei giocatori dopo l'eliminazione
        setOpenConfirmDialog(false);
      } catch (error) {
        console.error('Errore durante l\'eliminazione del giocatore:', error);
        setErrorSnackbar(true);
        setOpenConfirmDialog(false);
      }
    }
  };

  const handleOpenConfirmDialog = (giocatoreId) => {
    setSelectedGiocatore(giocatoreId);
    setOpenConfirmDialog(true);
  };

  return (
    <Paper sx={{ padding: 2, margin: 2 }}>
      <Typography variant="h5" gutterBottom>
        Lista Giocatori
      </Typography>
      <Grid container spacing={2}>
        {giocatori.map((giocatore) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={giocatore.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {giocatore.nome}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  color="error"
                  onClick={() => handleOpenConfirmDialog(giocatore.id)}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog di conferma per eliminare un giocatore */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler eliminare questo giocatore?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Annulla</Button>
          <Button onClick={handleEliminaGiocatore} color="error" variant="contained">
            Elimina
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar per notificare l'eliminazione */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Giocatore eliminato con successo!"
      />

      {/* Snackbar per errori */}
      <Snackbar
        open={errorSnackbar}
        autoHideDuration={3000}
        onClose={() => setErrorSnackbar(false)}
        message="Si è verificato un errore."
        color="error"
      />
    </Paper>
  );
}

export default Giocatori;
