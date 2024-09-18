// src/components/GolAssist.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Typography,
  Paper,
  Box,
  IconButton,
  Button,
  Snackbar,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

function GolAssist() {
  const { partitaId } = useParams();
  const [partecipazioni, setPartecipazioni] = useState([]);
  const [golAssist, setGolAssist] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const fetchPartecipazioni = useCallback(async () => {
    try {
      const response = await axios.get(`/api/partite/${partitaId}/partecipazioni`);
      setPartecipazioni(response.data);
    } catch (error) {
      console.error('Errore nel recupero delle partecipazioni:', error);
    }
  }, [partitaId]);
  

  useEffect(() => {
    fetchPartecipazioni();
  }, [fetchPartecipazioni]);



  const handleChangeGol = (giocatoreId, increment) => {
    setGolAssist((prev) => {
      const currentGol = parseInt(prev[`gol_${giocatoreId}`] || 0);
      return {
        ...prev,
        [`gol_${giocatoreId}`]: currentGol + increment >= 0 ? currentGol + increment : 0,
      };
    });
  };

  const handleChangeAssist = (giocatoreId, increment) => {
    setGolAssist((prev) => {
      const currentAssist = parseInt(prev[`assist_${giocatoreId}`] || 0);
      return {
        ...prev,
        [`assist_${giocatoreId}`]: currentAssist + increment >= 0 ? currentAssist + increment : 0,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`/api/partite/${partitaId}/gol_assist`, golAssist);
      setOpenSnackbar(true);
      navigate('/partite');
    } catch (error) {
      console.error('Errore durante l\'invio dei dati:', error);
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Aggiungi Gol e Assist - Step 2
      </Typography>
      {partecipazioni.map((p) => (
        <Box key={p.giocatore_id} sx={{ marginBottom: 2 }}>
          <Typography variant="h6">{p.nome}</Typography>
          <Typography variant="subtitle1">Squadra: {p.squadra}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
            <Typography>Gol:</Typography>
            <IconButton onClick={() => handleChangeGol(p.giocatore_id, -1)}>
              <Remove />
            </IconButton>
            <Typography>{golAssist[`gol_${p.giocatore_id}`] || 0}</Typography>
            <IconButton onClick={() => handleChangeGol(p.giocatore_id, 1)}>
              <Add />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>Assist:</Typography>
            <IconButton onClick={() => handleChangeAssist(p.giocatore_id, -1)}>
              <Remove />
            </IconButton>
            <Typography>{golAssist[`assist_${p.giocatore_id}`] || 0}</Typography>
            <IconButton onClick={() => handleChangeAssist(p.giocatore_id, 1)}>
              <Add />
            </IconButton>
          </Box>
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Salva Gol e Assist
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Gol e assist salvati con successo!"
      />
    </Paper>
  );
}

export default GolAssist;
