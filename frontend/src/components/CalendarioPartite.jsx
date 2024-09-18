// src/components/CalendarioPartite.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
} from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, parseISO } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import itLocale from 'date-fns/locale/it';
import { useNavigate } from 'react-router-dom';
import CustomEvent from './CustomEvent'; // Importa il componente personalizzato
import AggiungiPartita from './AggiungiPartita'; // Importa il componente esistente
import './CustomEvent.css'; // Importa dopo

const locales = {
  'it': itLocale,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Inizia la settimana di lunedì
  getDay,
  locales,
});

function CalendarioPartite() {
  const [eventi, setEventi] = useState([]);
  const [openAggiungiDialog, setOpenAggiungiDialog] = useState(false);
  const [dataSelezionata, setDataSelezionata] = useState(null);
  const [partitaDaEliminare, setPartitaDaEliminare] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPartite();
  }, []);

  const fetchPartite = async () => {
    try {
      const response = await axios.get('/api/partite');
      const eventiCalendario = response.data.map((partita) => ({
        id: partita.id,
        gol_bianchi: partita.gol_bianchi,
        gol_colorati: partita.gol_colorati,
        title: `Bianchi ${partita.gol_bianchi} - Colorati ${partita.gol_colorati}`,
        start: parseISO(partita.data),
        end: parseISO(partita.data),
        allDay: true,
        partitaId: partita.id,
      }));
      setEventi(eventiCalendario);
    } catch (error) {
      console.error('Errore nel recupero delle partite:', error);
      setErrorSnackbar({ open: true, message: 'Errore nel recupero delle partite.' });
    }
  };

  const handleSelectSlot = ({ start }) => {
    // Verifica se esiste già una partita in questa data
    const hasMatch = eventi.some(evento => {
      const eventoDate = new Date(evento.start).setHours(0,0,0,0);
      const selectedDate = new Date(start).setHours(0,0,0,0);
      return eventoDate === selectedDate;
    });

    if (hasMatch) {
      setErrorSnackbar({ open: true, message: 'Esiste già una partita in questa data.' });
      return;
    }

    setDataSelezionata(start);
    setOpenAggiungiDialog(true);
  };

  const handleCloseAggiungiDialog = () => {
    setOpenAggiungiDialog(false);
    setDataSelezionata(null);
  };

  const handleAggiungiPartitaSuccess = () => {
    setOpenSnackbar(true);
    fetchPartite();
    handleCloseAggiungiDialog();
  };

  const handleDeletePartita = (partitaId) => {
    setPartitaDaEliminare(partitaId);
    setOpenConfirmDialog(true);
  };

  const confirmDeletePartita = async () => {
    if (partitaDaEliminare) {
      try {
        await axios.delete(`/api/partite/${partitaDaEliminare}`);
        setOpenSnackbar(true);
        fetchPartite(); // Ricarica le partite dopo l'eliminazione
        setOpenConfirmDialog(false);
      } catch (error) {
        console.error('Errore durante l\'eliminazione della partita:', error);
        setErrorSnackbar({ open: true, message: 'Errore durante l\'eliminazione della partita.' });
        setOpenConfirmDialog(false);
      }
    }
  };

  const handleEventClick = (event) => {
    navigate(`/partite/${event.partitaId}`);
  };

  return (
    <Paper sx={{ padding: 2, margin: 2, backgroundColor: '#fff8e1' }}> {/* Sfondo giallo chiaro */}
      <Typography variant="h5" gutterBottom sx={{ color: '#00695c', fontFamily: 'Shadows Into Light, cursive' }}>
        Calendario Partite
      </Typography>
      <Calendar
  localizer={localizer}
  events={eventi}
  startAccessor="start"
  endAccessor="end"
  selectable
  onSelectSlot={handleSelectSlot}
  onSelectEvent={handleEventClick}
  style={{ height: 800 }} // Aumenta l'altezza
  views={['month', 'week', 'day']}
  defaultView="month"
  components={{
    event: (props) => (
      <CustomEvent
        {...props}
        onDelete={(partitaId) => {
          handleDeletePartita(partitaId);
        }}
      />
    ),
    toolbar: (toolbar) => (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <Button variant="contained" color="primary" onClick={() => toolbar.onNavigate('TODAY')}>
            Oggi
          </Button>
          <Button variant="contained" color="primary" onClick={() => toolbar.onNavigate('PREV')}>
            Indietro
          </Button>
          <Button variant="contained" color="primary" onClick={() => toolbar.onNavigate('NEXT')}>
            Avanti
          </Button>
        </span>
        <span className="rbc-toolbar-label" style={{ fontFamily: 'Shadows Into Light, cursive', color: '#838072' }}>
          {toolbar.label}
        </span>
        <span className="rbc-btn-group">
          <Button variant="contained" color="secondary" onClick={() => toolbar.onView('month')}>
            Mese
          </Button>
          <Button variant="contained" color="secondary" onClick={() => toolbar.onView('week')}>
            Settimana
          </Button>
          <Button variant="contained" color="secondary" onClick={() => toolbar.onView('day')}>
            Giorno
          </Button>
        </span>
      </div>
    ),
  }}
  messages={{
    next: 'Avanti',
    previous: 'Indietro',
    today: 'Oggi',
    month: 'Mese',
    week: 'Settimana',
    day: 'Giorno',
    agenda: 'Agenda',
  }}
/>

      {/* Dialog per aggiungere una partita */}
      <Dialog open={openAggiungiDialog} onClose={handleCloseAggiungiDialog} maxWidth="lg" fullWidth>
        <DialogTitle>Aggiungi Partita</DialogTitle>
        <DialogContent>
          <AggiungiPartita selectedDate={dataSelezionata} onSuccess={handleAggiungiPartitaSuccess} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAggiungiDialog}>Annulla</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog di conferma per eliminare una partita */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler eliminare questa partita?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Annulla</Button>
          <Button onClick={confirmDeletePartita} color="error" variant="contained">
            Elimina
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar per notificare l'aggiunta o l'eliminazione */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Operazione completata con successo!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* Snackbar per errori */}
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

export default CalendarioPartite;
