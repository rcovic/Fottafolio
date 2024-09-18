// src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Giocatori from './components/Giocatori';
import Partite from './components/Partite';
import AggiungiPartita from './components/AggiungiPartita';
import GolAssist from './components/GolAssist';
import Statistiche from './components/Statistiche';

function App() {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Statistiche Calcetto
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/giocatori">Giocatori</Button>
          <Button color="inherit" component={Link} to="/partite">Partite</Button>
          <Button color="inherit" component={Link} to="/statistiche">Statistiche</Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '2rem' }}>
        <Routes>
          <Route path="/" element={<div>Benvenuto nel sistema di statistiche di calcetto!</div>} />
          <Route path="/giocatori" element={<Giocatori />} />
          <Route path="/partite/:partitaId" element={<DettagliPartita />} />
          <Route path="/aggiungi_partita" element={<AggiungiPartita />} />
          <Route path="/gol_assist/:partitaId" element={<GolAssist />} />
          <Route path="/statistiche" element={<Statistiche />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
