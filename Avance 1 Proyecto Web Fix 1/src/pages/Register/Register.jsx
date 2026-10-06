import { Link as RouterLink } from 'react-router-dom';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AuthHeader from '../../components/organisms/AuthHeader/AuthHeader';
import RegisterForm from './components/RegisterForm/RegisterForm';

export default function Register() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AuthHeader />
      <Box sx={{ position: 'relative', px: 3, pt: 4, pb: 6 }}>
        <IconButton
          component={RouterLink}
          to="/"
          aria-label="Volver"
          sx={{
            position: 'absolute',
            left: { xs: 16, md: 40 },
            top: 32,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Crear Cuenta
        </Typography>
        <RegisterForm />
      </Box>
    </Box>
  );
}
