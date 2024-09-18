// src/components/CustomEvent.jsx

import React from 'react';
import { Card, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './CustomEvent.css'; // Assicurati che il file CSS esista

// Lista di colori per i post-it
const postItColors = ['#FFEB3B', '#FFCDD2', '#BBDEFB', '#C8E6C9', '#FFE0B2', '#E1BEE7'];

function CustomEvent({ event, onDelete }) {
  // Determina il colore basato sull'ID dell'evento per avere consistenza
  const colorIndex = event.id % postItColors.length;
  const backgroundColor = postItColors[colorIndex];

  return (
    <Card className="post-it" style={{ backgroundColor }}>
      <Typography variant="body2" className="handwritten-font">
        {event.title}
      </Typography>
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
