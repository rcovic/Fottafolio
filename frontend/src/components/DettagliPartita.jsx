// src/components/DettagliPartita.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography,
  Paper,
  CircularProgress,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';

function DettagliPartita() {
  const { partitaId } = useParams();
  const [partita, setPartita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartita = async () => {
      try {
        const response = await axios.get(`/api/partite/${partitaId}`);
        setPartita(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Errore nel recupero dei dettagli della partita:', err);
        setError('Non è stato possibile recuperare i dettagli della partita.');
        setLoading(false);
      }
    };

    fetchPartita();
  }, [partitaId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" component={Link} to="/partite">
          Torna al Calendario
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Button variant="contained" component={Link} to="/partite" sx={{ marginBottom: 2 }}>
        Torna al Calendario
      </Button>
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dettagli Partita
        </Typography>
        <Typography variant="h6">
          Data: {new Date(partita.data).toLocaleDateString('it-IT', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>
        <Typography variant="h6">
          Squadra Bianchi: {partita.gol_bianchi} Gol
        </Typography>
        <Typography variant="h6">
          Squadra Colorati: {partita.gol_colorati} Gol
        </Typography>

        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" gutterBottom>
            Partecipanti
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome Giocatore</TableCell>
                <TableCell>Squadra</TableCell>
                <TableCell>Gol</TableCell>
                <TableCell>Assist</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {partita.partecipazioni.map((partecipazione) => (
                <TableRow key={partecipazione.id}>
                  <TableCell>{partecipazione.nome}</TableCell>
                  <TableCell>{partecipazione.squadra}</TableCell>
                  <TableCell>{partecipazione.gol}</TableCell>
                  <TableCell>{partecipazione.assist}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}

export default DettagliPartita;
