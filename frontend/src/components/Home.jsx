// src/components/Home.jsx

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  Grid,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  CardHeader,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

function Home() {
  const [statistiche, setStatistiche] = useState(null);

  useEffect(() => {
    fetchStatistiche();
  }, []);

  const fetchStatistiche = async () => {
    try {
      const response = await axios.get('/api/statistiche');
      setStatistiche(response.data);
    } catch (error) {
      console.error('Errore nel recupero delle statistiche:', error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Banner di Benvenuto */}
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          backgroundImage: 'url(/banner.jpg)', // Assicurati di avere un'immagine banner nella cartella public
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          marginBottom: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Benvenuto su Fottafolio!
        </Typography>
        <Typography variant="h6">
          La tua applicazione di riferimento per gestire e visualizzare tutte le tue partite di calcetto.
        </Typography>
      </Paper>

      {/* Sezione delle Funzionalità Principali */}
      <Grid container spacing={4} sx={{ marginBottom: 4 }}>
        {/* Partite */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardHeader
              avatar={<SportsSoccerIcon color="primary" fontSize="large" />}
              title="Partite"
              titleTypographyProps={{ variant: 'h6', align: 'center' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="body1" align="center">
                Visualizza il calendario delle tue partite e aggiungi nuove sfide direttamente dal calendario.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/partite"
                startIcon={<SportsSoccerIcon />}
              >
                Vai a Partite
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Giocatori */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardHeader
              avatar={<GroupIcon color="secondary" fontSize="large" />}
              title="Giocatori"
              titleTypographyProps={{ variant: 'h6', align: 'center' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="body1" align="center">
                Gestisci i tuoi giocatori, visualizza le loro statistiche e migliora le tue squadre.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/giocatori"
                startIcon={<GroupIcon />}
              >
                Vai a Giocatori
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Statistiche */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardHeader
              avatar={<BarChartIcon color="success" fontSize="large" />}
              title="Statistiche"
              titleTypographyProps={{ variant: 'h6', align: 'center' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="body1" align="center">
                Analizza le performance delle tue squadre e giocatori con grafici interattivi e tabelle ordinate.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="success"
                component={Link}
                to="/statistiche"
                startIcon={<BarChartIcon />}
              >
                Vai a Statistiche
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Aggiungi Partita */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardHeader
              avatar={<AddBoxIcon color="warning" fontSize="large" />}
              title="Aggiungi Partita"
              titleTypographyProps={{ variant: 'h6', align: 'center' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="body1" align="center">
                Programma nuove partite cliccando su un giorno vuoto nel calendario o utilizza il modulo di aggiunta.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="warning"
                component={Link}
                to="/aggiungi_partita"
                startIcon={<AddBoxIcon />}
              >
                Aggiungi Partita
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Sezione Statistiche (Anteprima) */}
      {statistiche && (
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" gutterBottom>
            Statistiche Principali
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistiche.squadre_stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="squadra" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="vittorie" fill="#4caf50" name="Vittorie" />
              <Bar dataKey="sconfitte" fill="#f44336" name="Sconfitte" />
              <Bar dataKey="pareggi" fill="#ff9800" name="Pareggi" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Sezione Informativa */}
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Informazioni su Fottafolio
        </Typography>
        <Typography variant="body1">
          Fottafolio è l'applicazione ideale per gestire tutte le tue partite di calcetto. Organizza il calendario, monitora le statistiche dei giocatori e delle squadre, e aggiungi nuove partite con facilità. Che tu sia un giocatore, un allenatore o un appassionato, Fottafolio ti offre tutti gli strumenti necessari per tenere traccia delle tue sfide sportive.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Home;
