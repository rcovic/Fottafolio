// src/components/CustomEvent.jsx

import React, { useState } from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import { Delete } from '@mui/icons-material';

function CustomEvent({ event, onDelete }) {
  const [hover, setHover] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation(); // Previene la navigazione ai dettagli
    onDelete(event.partitaId);
  };

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{ position: 'relative', cursor: 'pointer' }}
    >
      <Typography variant="body2">
        {event.title}
      </Typography>
      {hover && (
        <IconButton
          size="small"
          color="error"
          onClick={handleDelete}
          sx={{ position: 'absolute', top: 0, right: 0 }}
        >
          <Delete fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}

export default CustomEvent;
