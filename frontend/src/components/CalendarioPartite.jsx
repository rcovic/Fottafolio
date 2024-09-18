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
} from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, parseISO } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import itLocale from 'date-fns/locale/it';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    fetchPartite();
  }, []);

  const fetchPartite = async () => {
    try {
      const response = await axios.get('/api/partite');
      // Trasforma le partite in eventi per il calendario
      const eventiCalendario = response.data.map((partita) => ({
        id: partita.id,
        title: `Partita`,
        start: parseISO(partita.data),
        end: parseISO(partita.data),
        allDay: true,
        partitaId: partita.id,
      }));
      setEventi(eventiCalendario);
    } catch (error) {
      console.error('Errore nel recupero delle partite:', error);
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

  const handleSelectEvent = (event) => {
    // Puoi decidere cosa fare quando si clicca su un evento
    // Ad esempio, mostrare i dettagli della partita o permettere di modificarla
    navigate(`/partite/${event.partitaId}`);
  };

  return (
    <Paper sx={{ padding: 2 }}>
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
        onSelectEvent={handleSelectEvent}
        style={{ height: 600 }}
        messages={{
          next: 'Avanti',
          previous: 'Indietro',
          today: 'Oggi',
          month: 'Mese',
          week: 'Settimana',
          day: 'Giorno',
        }}
      />
      {/* Dialog per confermare l'aggiunta di una partita */}
      <Dialog open={!!selectedDate} onClose={handleCloseDialog}>
        <DialogTitle>Aggiungi Partita</DialogTitle>
        <DialogContent>
          <Typography>
            Vuoi aggiungere una partita per il giorno{' '}
            {format(selectedDate, 'dd/MM/yyyy', { locale: itLocale })}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button onClick={handleAggiungiPartita} variant="contained" color="primary">
            Aggiungi Partita
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default CalendarioPartite;
