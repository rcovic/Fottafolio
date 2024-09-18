// src/components/Statistiche.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TableContainer,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function Statistiche() {
  const [statistiche, setStatistiche] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [visualizzazioneGiocatori, setVisualizzazioneGiocatori] = useState('grafico');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nome');

  useEffect(() => {
    fetchStatistiche();
  }, []);

  const fetchStatistiche = async () => {
    try {
      const response = await axios.get('/api/statistiche');
      const data = response.data;

      // Calcola la percentuale di vittorie per ogni giocatore
      const giocatoriStats = data.giocatori_stats.map((giocatore) => {
        const totalePartite =
          giocatore.vittorie + giocatore.sconfitte + giocatore.pareggi;
        const percentualeVittorie =
          totalePartite > 0 ? (giocatore.vittorie / totalePartite) * 100 : 0;
        return {
          ...giocatore,
          percentualeVittorie: percentualeVittorie.toFixed(2), // Arrotonda a due decimali
        };
      });

      // Calcola la percentuale di vittorie per ogni squadra
      const squadreStats = data.squadre_stats.map((squadra) => {
        const totalePartite = squadra.vittorie + squadra.sconfitte + squadra.pareggi;
        const percentualeVittorie =
          totalePartite > 0 ? (squadra.vittorie / totalePartite) * 100 : 0;
        return {
          ...squadra,
          percentualeVittorie: percentualeVittorie.toFixed(2),
        };
      });

      setStatistiche({
        giocatori_stats: giocatoriStats,
        squadre_stats: squadreStats,
      });
    } catch (error) {
      console.error('Errore nel recupero delle statistiche:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleVisualizzazioneGiocatori = (event, newValue) => {
    setVisualizzazioneGiocatori(newValue);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const orderCmp = comparator(a[0], b[0]);
      if (orderCmp !== 0) return orderCmp;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (Number(b[orderBy]) < Number(a[orderBy])) return -1;
    if (Number(b[orderBy]) > Number(a[orderBy])) return 1;
    return 0;
  };

  if (!statistiche) {
    return (
      <Typography variant="h6" align="center">
        Caricamento delle statistiche in corso...
      </Typography>
    );
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Statistiche
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Squadre" />
        <Tab label="Giocatori" />
      </Tabs>
      {tabValue === 0 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            Statistiche delle Squadre
          </Typography>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'squadra'}
                      direction={orderBy === 'squadra' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'squadra')}
                    >
                      Squadra
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={orderBy === 'vittorie'}
                      direction={orderBy === 'vittorie' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'vittorie')}
                    >
                      Vittorie
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={orderBy === 'sconfitte'}
                      direction={orderBy === 'sconfitte' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'sconfitte')}
                    >
                      Sconfitte
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={orderBy === 'pareggi'}
                      direction={orderBy === 'pareggi' ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, 'pareggi')}
                    >
                      Pareggi
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={orderBy === 'percentualeVittorie'}
                      direction={orderBy === 'percentualeVittorie' ? order : 'asc'}
                      onClick={(event) =>
                        handleRequestSort(event, 'percentualeVittorie')
                      }
                    >
                      % Vittorie
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(
                  statistiche.squadre_stats,
                  getComparator(order, orderBy)
                ).map((squadra) => (
                  <TableRow key={squadra.squadra}>
                    <TableCell>{squadra.squadra}</TableCell>
                    <TableCell align="right">{squadra.vittorie}</TableCell>
                    <TableCell align="right">{squadra.sconfitte}</TableCell>
                    <TableCell align="right">{squadra.pareggi}</TableCell>
                    <TableCell align="right">
                      {squadra.percentualeVittorie}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {tabValue === 1 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            Statistiche dei Giocatori
          </Typography>
          <Tabs
            value={visualizzazioneGiocatori}
            onChange={handleVisualizzazioneGiocatori}
            centered
            sx={{ marginBottom: 2 }}
          >
            <Tab value="grafico" label="Grafico" />
            <Tab value="tabella" label="Tabella" />
          </Tabs>
          {visualizzazioneGiocatori === 'grafico' && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={statistiche.giocatori_stats}
                layout="vertical"
                margin={{ left: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="nome" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="gol" fill="#4caf50" name="Gol" />
                <Bar dataKey="assist" fill="#2196f3" name="Assist" />
                <Bar dataKey="vittorie" fill="#9c27b0" name="Vittorie" />
                <Bar dataKey="sconfitte" fill="#f44336" name="Sconfitte" />
                <Bar dataKey="pareggi" fill="#ff9800" name="Pareggi" />
              </BarChart>
            </ResponsiveContainer>
          )}
          {visualizzazioneGiocatori === 'tabella' && (
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'nome'}
                        direction={orderBy === 'nome' ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, 'nome')}
                      >
                        Giocatore
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'gol'}
                        direction={orderBy === 'gol' ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, 'gol')}
                      >
                        Gol
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'assist'}
                        direction={orderBy === 'assist' ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, 'assist')}
                      >
                        Assist
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'vittorie'}
                        direction={orderBy === 'vittorie' ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, 'vittorie')}
                      >
                        Vittorie
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'sconfitte'}
                        direction={orderBy === 'sconfitte' ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, 'sconfitte')}
                      >
                        Sconfitte
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'pareggi'}
                        direction={orderBy === 'pareggi' ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, 'pareggi')}
                      >
                        Pareggi
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'percentualeVittorie'}
                        direction={orderBy === 'percentualeVittorie' ? order : 'asc'}
                        onClick={(event) =>
                          handleRequestSort(event, 'percentualeVittorie')
                        }
                      >
                        % Vittorie
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stableSort(
                    statistiche.giocatori_stats,
                    getComparator(order, orderBy)
                  ).map((giocatore) => (
                    <TableRow key={giocatore.nome}>
                      <TableCell>{giocatore.nome}</TableCell>
                      <TableCell align="right">{giocatore.gol}</TableCell>
                      <TableCell align="right">{giocatore.assist}</TableCell>
                      <TableCell align="right">{giocatore.vittorie}</TableCell>
                      <TableCell align="right">{giocatore.sconfitte}</TableCell>
                      <TableCell align="right">{giocatore.pareggi}</TableCell>
                      <TableCell align="right">
                        {giocatore.percentualeVittorie}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Paper>
  );
}

export default Statistiche;
