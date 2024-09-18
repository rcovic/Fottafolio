import { createTheme } from '@mui/material/styles';
import { yellow, grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: yellow[700], // Colore primario (es. giallo scuro)
    },
    secondary: {
      main: grey[800], // Colore secondario (es. grigio scuro)
    },
    text: {
      primary: '#000', // Assicurati che il testo primario sia visibile
      secondary: grey[600], // Testo secondario visibile per i tab non selezionati
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: grey[600], // Colore per i tab non selezionati
          '&.Mui-selected': {
            color: yellow[700], // Colore del tab selezionato
          },
        },
      },
    },
  },
});

export default theme;
