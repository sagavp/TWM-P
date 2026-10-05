import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#B32028' },
    background: { default: '#BEB3AD', paper: '#FFFFFF' },
    text: { primary: '#000000' },
    divider: '#DFDFDF',
    action: { active: '#CCCCCC' },
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: '"Outfit", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, color: '#000000' },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '1.05rem' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: '#BEB3AD' } },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          boxShadow: 'none',
          minHeight: 64,
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 18,
          minHeight: 64,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#DFDFDF',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#B32028',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#B32028',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::placeholder': {
            color: '#000000',
            opacity: 1,
          },
        },
      },
    },
  },
});

export default theme;
