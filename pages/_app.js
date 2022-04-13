import '../styles/globals.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function MyApp({ Component, pageProps }) {
  const theme = createTheme({
    palette: {
      type: 'dark',
      mode : 'dark',
      primary: {
        main: '#5893df',
      },
      secondary: {
        main: '#2ec5d3',
      },
      background: {
        default: '#192231',
        paper: '#24344d',
      },
    },
    typography: {
      fontSize: 12,
      fontFamily: 'Slabo 27px',
    },
  });
  
  return (
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
  );
}

export default MyApp
