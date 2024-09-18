// src/components/AggiungiPartita.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Typography,
  Paper,
  Box,
  IconButton,
  TextField,
  Autocomplete,
  Snackbar,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useLocation } from 'react-router-dom';

function AggiungiPartita() {
  const [giocatori, setGiocatori] = useState([]);
  const [data, setData] = useState(null);
  const [golBianchi, setGolBianchi] = useState(0);
  const [golColorati, setGolColorati] = useState(0);
  const [squadraBianchi, setSquadraBianchi] = useState([]);
  const [squadraColorati, setSquadraColorati] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dataSelezionata = location.state?.dataSelezionata
    ? new Date(location.state.dataSelezionata)
    : null;


  useEffect(() => {
    fetchGiocatori();
  }, []);

  const fetchGiocatori = async () => {
    try {
      const response = await axios.get('/api/giocatori');
      setGiocatori(response.data);
    } catch (error) {
      console.error('Errore nel recupero dei giocatori:', error);
    }
  };

  const handleSubmit = async () => {
    if (!data) {
      alert('Per favore, seleziona una data.');
      return;
    }
    if (squadraBianchi.length === 0 || squadraColorati.length === 0) {
      alert('Per favore, seleziona i giocatori per entrambe le squadre.');
      return;
    }
    try {
      const response = await axios.post('/api/partite', {
        data: data.toISOString().split('T')[0],
        gol_bianchi: golBianchi,
        gol_colorati: golColorati,
        squadra_bianchi: squadraBianchi,
        squadra_colorati: squadraColorati,
      });
      navigate(`/gol_assist/${response.data.partita_id}`);
    } catch (error) {
      console.error('Errore durante l\'invio dei dati:', error);
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Aggiungi Partita - Step 1
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
      <Box sx={{ marginBottom: 2 }}>
        <DatePicker
            selected={data}
            onChange={(date) => setData(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Seleziona una data"
            customInput={<TextField label="Data" fullWidth />}
        />
</Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h6" sx={{ marginRight: 2 }}>
          Gol Squadra Bianchi:
        </Typography>
        <IconButton onClick={() => setGolBianchi(Math.max(golBianchi - 1, 0))}>
          <Remove />
        </IconButton>
        <Typography variant="h6">{golBianchi}</Typography>
        <IconButton onClick={() => setGolBianchi(golBianchi + 1)}>
          <Add />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h6" sx={{ marginRight: 2 }}>
          Gol Squadra Colorati:
        </Typography>
        <IconButton onClick={() => setGolColorati(Math.max(golColorati - 1, 0))}>
          <Remove />
        </IconButton>
        <Typography variant="h6">{golColorati}</Typography>
        <IconButton onClick={() => setGolColorati(golColorati + 1)}>
          <Add />
        </IconButton>
      </Box>
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Giocatori Squadra Bianchi
      </Typography>
      <Autocomplete
        multiple
        options={giocatori}
        getOptionLabel={(option) => option.nome}
        onChange={(event, value) => setSquadraBianchi(value.map((g) => g.id))}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Squadra Bianchi" />
        )}
        sx={{ marginBottom: 2 }}
      />
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Giocatori Squadra Colorati
      </Typography>
      <Autocomplete
        multiple
        options={giocatori}
        getOptionLabel={(option) => option.nome}
        onChange={(event, value) => setSquadraColorati(value.map((g) => g.id))}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Squadra Colorati" />
        )}
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Prosegui al Passo 2
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Partita aggiunta con successo!"
      />
    </Paper>
  );
}

export default AggiungiPartita;
