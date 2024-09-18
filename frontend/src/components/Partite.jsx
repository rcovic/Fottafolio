// src/components/Partite.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Paper,
  Snackbar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Delete } from '@mui/icons-material';

function Partite() {
  const [partite, setPartite] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchPartite();
  }, []);

  const fetchPartite = async () => {
    try {
      const response = await axios.get('/api/partite');
      setPartite(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const eliminaPartita = async (partitaId) => {
    try {
      await axios.delete(`/api/partite/${partitaId}`);
      fetchPartite();
      setOpenSnackbar(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Partite
      </Typography>
      <Grid container spacing={2}>
        {partite.map((partita) => (
          <Grid item xs={12} sm={6} md={4} key={partita.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {new Date(partita.data).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  Bianchi {partita.gol_bianchi} - {partita.gol_colorati} Colorati
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="secondary"
                  startIcon={<Delete />}
                  onClick={() => eliminaPartita(partita.id)}
                >
                  Elimina
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/aggiungi_partita"
        sx={{ marginTop: 2 }}
      >
        Aggiungi una nuova partita
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Partita eliminata con successo!"
      />
    </Paper>
  );
}

export default Partite;
