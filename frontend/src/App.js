// src/App.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Giocatori from './components/Giocatori';
import AggiungiPartita from './components/AggiungiPartita';
import CalendarioPartite from './components/CalendarioPartite'; // Importa il nuovo componente
import GolAssist from './components/GolAssist';
import Statistiche from './components/Statistiche';
import DettagliPartita from './components/DettagliPartita'; 
import Home from './components/Home';

function App() {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          {/* Icona del menu, utile se in futuro vuoi aggiungere un drawer */}
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          {/* Titolo dell'applicazione */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fottafolio
          </Typography>
          {/* Pulsanti di navigazione */}
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/giocatori">
            Giocatori
          </Button>
          <Button color="inherit" component={Link} to="/partite">
            Partite
          </Button>
          <Button color="inherit" component={Link} to="/statistiche">
            Statistiche
          </Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '2rem' }}>
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                  Benvenuto in Fottafolio!
                </Typography>
                <Typography variant="body1">
                  Gestisci le tue partite di calcetto e le statistiche dei giocatori.
                </Typography>
              </div>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/partite" element={<CalendarioPartite />} />
          <Route path="/giocatori" element={<Giocatori />} />
          <Route path="/aggiungi_partita" element={<AggiungiPartita />} />
          <Route path="/gol_assist/:partitaId" element={<GolAssist />} />
          <Route path="/statistiche" element={<Statistiche />} />
          <Route path="/partite/:partitaId" element={<DettagliPartita />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
