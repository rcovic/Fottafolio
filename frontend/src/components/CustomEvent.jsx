// src/components/CustomEvent.jsx

import React from 'react';
import { Card, Typography, IconButton, Box, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Icona del trofeo
import './CustomEvent.css'; // Assicurati che questo file esista

// Lista di colori per i post-it
const postItColors = ['#FFEB3B', '#FFCDD2', '#BBDEFB', '#C8E6C9', '#FFE0B2', '#E1BEE7'];

function CustomEvent({ event, onDelete }) {
  // Determina il colore basato sull'ID dell'evento per avere consistenza
  const colorIndex = event.id % postItColors.length;
  const backgroundColor = postItColors[colorIndex];

  // Determina il vincitore
  let winner = 'none';
  if (event.gol_bianchi > event.gol_colorati) {
    winner = 'bianchi';
  } else if (event.gol_colorati > event.gol_bianchi) {
    winner = 'colorati';
  }

  // Imposta il colore del trofeo in base al vincitore
  const trophyColor = winner === 'colorati' ? '#000000' : winner === 'bianchi' ? '#FFFFFF' : 'transparent';

  // Stile per ingrandire e spostare il trofeo
  const trophyStyle = {
    color: trophyColor,
    fontSize: '24px', // Più grande
    textShadow:
      winner === 'colorati' || winner === 'bianchi'
        ? '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000'
        : 'none',
  };

  return (
    <Card className="post-it" style={{ backgroundColor }}>
      {/* Icona del Trofeo nell'angolo in alto a destra con Tooltip */}
      {winner !== 'none' && (
        <Box className="trophy-icon">
          <Tooltip title={winner === 'colorati' ? 'Colorati hanno vinto' : 'Bianchi hanno vinto'}>
            <EmojiEventsIcon style={trophyStyle} aria-label={winner === 'colorati' ? 'Vincitore Colorati' : 'Vincitore Bianchi'} />
          </Tooltip>
        </Box>
      )}

      {/* Testo su due linee */}
      <Typography variant="body2" className="handwritten-font">
        <Box
          display="flex"
          alignItems="center"
          mb={0.5}
          className={winner === 'bianchi' ? 'winner-text' : ''}
        >
          Bianchi {event.gol_bianchi}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          className={winner === 'colorati' ? 'winner-text' : ''}
        >
          Colorati {event.gol_colorati}
        </Box>
      </Typography>

      {/* Pulsante di eliminazione */}
      <IconButton
        size="small"
        color="error"
        onClick={() => onDelete(event.partitaId)}
        className="delete-button"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Card>
  );
}

export default CustomEvent;
