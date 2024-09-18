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

const locales = {
  'it': itLocale,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarioPartite() {
  const [eventi, setEventi] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [partitaDaEliminare, setPartitaDaEliminare] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPartite();
  }, []);

  const fetchPartite = async () => {
    try {
      const response = await axios.get('/api/partite');
      const eventiCalendario = response.data.map((partita) => ({
        id: partita.id,
        title: `Partita: Bianchi ${partita.gol_bianchi} - Colorati ${partita.gol_colorati}`,
        start: parseISO(partita.data),
        end: parseISO(partita.data),
        allDay: true,
        partitaId: partita.id,
      }));
      setEventi(eventiCalendario);
    } catch (error) {
      console.error('Errore nel recupero delle partite:', error);
      setErrorSnackbar(true);
    }
  };

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
  };

  const handleCloseDialog = () => {
    setSelectedDate(null);
  };

  const handleAggiungiPartita = () => {
    navigate('/aggiungi_partita', { state: { dataSelezionata: selectedDate } });
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
        setErrorSnackbar(true);
        setOpenConfirmDialog(false);
      }
    }
  };

  const handleEventClick = (event) => {
    navigate(`/partite/${event.partitaId}`);
  };

  return (
    <Paper sx={{ padding: 2, margin: 2 }}>
      <Typography variant="h5" gutterBottom>
        Calendario Partite
      </Typography>
      <Calendar
        localizer={localizer}
        events={eventi}
        startAccessor="start"
        endAccessor="end"
        selectable
        views={['month', 'week', 'day']}
        defaultView="month"
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventClick}
        style={{ height: 600 }}
        components={{
          event: (props) => (
            <CustomEvent
              {...props}
              onDelete={handleDeletePartita}
            />
          ),
        }}
        messages={{
          next: 'Avanti',
          previous: 'Indietro',
          today: 'Oggi',
          month: 'Mese',
          week: 'Settimana',
          day: 'Giorno',
        }}
      />

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

      {/* Snackbar per notificare l'eliminazione */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Partita eliminata con successo!"
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

export default CalendarioPartite;
