// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FBC02D', // Un giallo più morbido
    },
    secondary: {
      main: '#FFFFFF', // Bianco per contrasto
    },
    background: {
      default: '#F5F5F5', // Grigio chiaro per lo sfondo
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
