import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import itLocale from 'date-fns/locale/it';

function AggiungiPartita({ selectedDate, onSuccess }) {
  const navigate = useNavigate();
  const [data, setData] = useState(selectedDate || new Date());
  const [golBianchi, setGolBianchi] = useState(0);
  const [golColorati, setGolColorati] = useState(0);
  const [giocatori, setGiocatori] = useState([]);
  const [squadraBianchi, setSquadraBianchi] = useState([]);
  const [squadraColorati, setSquadraColorati] = useState([]);
  const [goalsBianchi, setGoalsBianchi] = useState({});
  const [assistsBianchi, setAssistsBianchi] = useState({});
  const [goalsColorati, setGoalsColorati] = useState({});
  const [assistsColorati, setAssistsColorati] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: '',
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);

  useEffect(() => {
    setData(selectedDate || new Date());
    fetchGiocatori();
  }, [selectedDate]);

  const fetchGiocatori = async () => {
    try {
      const response = await axios.get('/api/giocatori');
      setGiocatori(response.data);
    } catch (error) {
      console.error('Errore nel recupero dei giocatori:', error);
      setErrorSnackbar({ open: true, message: 'Errore nel recupero dei giocatori.' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenire l'invio automatico del modulo

    const sommaGolBianchi = squadraBianchi.reduce(
      (sum, id) => sum + (goalsBianchi[id] || 0),
      0
    );
    const sommaGolColorati = squadraColorati.reduce(
      (sum, id) => sum + (goalsColorati[id] || 0),
      0
    );

    const sommaAssistBianchi = squadraBianchi.reduce(
      (sum, id) => sum + (assistsBianchi[id] || 0),
      0
    );
    const sommaAssistColorati = squadraColorati.reduce(
      (sum, id) => sum + (assistsColorati[id] || 0),
      0
    );

    // Controllo per i gol della squadra Bianchi
    if (sommaGolBianchi > golBianchi) {
      setErrorSnackbar({ open: true, message: 'La somma dei gol per i Bianchi supera i gol totali.' });
      return;
    }

    // Controllo per i gol della squadra Colorati
    if (sommaGolColorati > golColorati) {
      setErrorSnackbar({ open: true, message: 'La somma dei gol per i Colorati supera i gol totali.' });
      return;
    }

    // Controllo per la somma minore dei gol
    if (sommaGolBianchi < golBianchi || sommaGolColorati < golColorati) {
      // Mostra il pop-up di conferma
      setConfirmCallback(() => async () => {
        await submitPartita();
      });
      setOpenConfirmDialog(true);
      return;
    }

    // Controllo per la somma degli assist: deve essere <= dei gol totali per squadra Bianchi
    if (sommaAssistBianchi > golBianchi) {
      setErrorSnackbar({ open: true, message: 'La somma degli assist per i Bianchi supera i gol totali.' });
      return;
    }

    // Controllo per la somma degli assist: deve essere <= dei gol totali per squadra Colorati
    if (sommaAssistColorati > golColorati) {
      setErrorSnackbar({ open: true, message: 'La somma degli assist per i Colorati supera i gol totali.' });
      return;
    }

    // Se tutto è OK, invia i dati
    submitPartita();
  };

  const submitPartita = async () => {
    try {
      const payload = {
        data: data.toISOString(),
        gol_bianchi: golBianchi,
        gol_colorati: golColorati,
        squadra_bianchi: squadraBianchi.map(id => ({
          giocatore_id: id,
          gol: goalsBianchi[id] || 0,
          assist: assistsBianchi[id] || 0,
        })),
        squadra_colorati: squadraColorati.map(id => ({
          giocatore_id: id,
          gol: goalsColorati[id] || 0,
          assist: assistsColorati[id] || 0,
        })),
      };
  
      await axios.post('/api/partite', payload);
      setOpenSnackbar(true);
      onSuccess(); // Notifica il componente padre del successo
      navigate('/partite'); // Torna al calendario dopo il successo
    } catch (error) {
      console.error('Errore durante l\'aggiunta della partita:', error);
      setErrorSnackbar({ open: true, message: 'Errore durante l\'aggiunta della partita.' });
    }
  };

  const handleSelectGiocatore = (giocatoreId, squadra) => {
    if (squadra === 'bianchi') {
      if (squadraColorati.includes(giocatoreId)) {
        setErrorSnackbar({ open: true, message: 'Un giocatore non può essere in entrambe le squadre.' });
        return;
      }
      setSquadraBianchi(prev =>
        prev.includes(giocatoreId) ? prev.filter(id => id !== giocatoreId) : [...prev, giocatoreId]
      );
      // Rimuovi dalla squadra colorati se precedentemente selezionato
      setSquadraColorati(prev => prev.filter(id => id !== giocatoreId));
    } else if (squadra === 'colorati') {
      if (squadraBianchi.includes(giocatoreId)) {
        setErrorSnackbar({ open: true, message: 'Un giocatore non può essere in entrambe le squadre.' });
        return;
      }
      setSquadraColorati(prev =>
        prev.includes(giocatoreId) ? prev.filter(id => id !== giocatoreId) : [...prev, giocatoreId]
      );
      // Rimuovi dalla squadra bianchi se precedentemente selezionato
      setSquadraBianchi(prev => prev.filter(id => id !== giocatoreId));
    }
  };

  const handleGoalsChange = (giocatoreId, squadra, value) => {
    const intValue = parseInt(value) || 0;
    if (squadra === 'bianchi') {
      setGoalsBianchi(prev => ({ ...prev, [giocatoreId]: intValue }));
    } else if (squadra === 'colorati') {
      setGoalsColorati(prev => ({ ...prev, [giocatoreId]: intValue }));
    }
  };

  const handleAssistsChange = (giocatoreId, squadra, value) => {
    const intValue = parseInt(value) || 0;
    if (squadra === 'bianchi') {
      setAssistsBianchi(prev => ({ ...prev, [giocatoreId]: intValue }));
    } else if (squadra === 'colorati') {
      setAssistsColorati(prev => ({ ...prev, [giocatoreId]: intValue }));
    }
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setConfirmCallback(null);
  };

  return (
    <Paper sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Aggiungi Partita
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Campo Data */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={itLocale}>
              <DatePicker
                label="Data Partita"
                value={data}
                onChange={(newValue) => {
                  setData(newValue);
                }}
                renderInput={(params) => <TextField {...params} required fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          {/* Campo Gol Bianchi */}
          <Grid item xs={12} sm={3}>
            <TextField
              label="Gol Squadra Bianchi"
              type="number"
              inputProps={{ min: 0 }}
              value={golBianchi}
              onChange={(e) => setGolBianchi(parseInt(e.target.value) || 0)}
              required
              fullWidth
            />
          </Grid>

          {/* Campo Gol Colorati */}
          <Grid item xs={12} sm={3}>
            <TextField
              label="Gol Squadra Colorati"
              type="number"
              inputProps={{ min: 0 }}
              value={golColorati}
              onChange={(e) => setGolColorati(parseInt(e.target.value) || 0)}
              required
              fullWidth
            />
          </Grid>

          {/* Selezione Giocatori per Squadra Bianchi */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Squadra Bianchi (Seleziona Giocatori)
            </Typography>
            <FormGroup>
              {giocatori.map((giocatore) => (
                <FormControlLabel
                  key={giocatore.id}
                  control={
                    <Checkbox
                      checked={squadraBianchi.includes(giocatore.id)}
                      onChange={() => handleSelectGiocatore(giocatore.id, 'bianchi')}
                      disabled={squadraColorati.includes(giocatore.id)}
                    />
                  }
                  label={giocatore.nome}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Selezione Giocatori per Squadra Colorati */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Squadra Colorati (Seleziona Giocatori)
            </Typography>
            <FormGroup>
              {giocatori.map((giocatore) => (
                <FormControlLabel
                  key={giocatore.id}
                  control={
                    <Checkbox
                      checked={squadraColorati.includes(giocatore.id)}
                      onChange={() => handleSelectGiocatore(giocatore.id, 'colorati')}
                      disabled={squadraBianchi.includes(giocatore.id)}
                    />
                  }
                  label={giocatore.nome}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Assegnazione Gol e Assist per Squadra Bianchi */}
          {squadraBianchi.length > 0 && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Assegna Gol e Assist (Squadra Bianchi)
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Giocatore</TableCell>
                    <TableCell>Gol</TableCell>
                    <TableCell>Assist</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {squadraBianchi.map(id => {
                    const giocatore = giocatori.find(g => g.id === id);
                    return (
                      <TableRow key={id}>
                        <TableCell>{giocatore ? giocatore.nome : 'Unknown'}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            inputProps={{ min: 0 }}
                            value={goalsBianchi[id] || ''}
                            onChange={(e) => handleGoalsChange(id, 'bianchi', e.target.value)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            inputProps={{ min: 0 }}
                            value={assistsBianchi[id] || ''}
                            onChange={(e) => handleAssistsChange(id, 'bianchi', e.target.value)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
          )}

          {/* Assegnazione Gol e Assist per Squadra Colorati */}
          {squadraColorati.length > 0 && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Assegna Gol e Assist (Squadra Colorati)
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Giocatore</TableCell>
                    <TableCell>Gol</TableCell>
                    <TableCell>Assist</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {squadraColorati.map(id => {
                    const giocatore = giocatori.find(g => g.id === id);
                    return (
                      <TableRow key={id}>
                        <TableCell>{giocatore ? giocatore.nome : 'Unknown'}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            inputProps={{ min: 0 }}
                            value={goalsColorati[id] || ''}
                            onChange={(e) => handleGoalsChange(id, 'colorati', e.target.value)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            inputProps={{ min: 0 }}
                            value={assistsColorati[id] || ''}
                            onChange={(e) => handleAssistsChange(id, 'colorati', e.target.value)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
          )}

          {/* Pulsanti di Submit */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary">
                Aggiungi Partita
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ marginLeft: 2 }}
                onClick={() => navigate('/partite')}
              >
                Annulla
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* Dialog di conferma */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Conferma Gol Inferiori ai Gol Totali</DialogTitle>
        <DialogContent>
          <Typography>
            La somma dei gol segnati è inferiore ai gol totali. Sei sicuro di voler procedere?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="secondary">Annulla</Button>
          <Button
            onClick={() => {
              confirmCallback();
              handleCloseConfirmDialog();
            }}
            color="primary"
          >
            Conferma
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar per notificare l'aggiunta */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Partita aggiunta con successo!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* Snackbar per errori */}
      <Snackbar
        open={errorSnackbar.open}
        autoHideDuration={3000}
        onClose={() => setErrorSnackbar({ ...errorSnackbar, open: false })}
        message={errorSnackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ color: 'error.main' }}
      />
    </Paper>
  );
}

export default AggiungiPartita;
