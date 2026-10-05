import Box from '@mui/material/Box';
import logo from '../../../assets/logo.png';

export default function AuthHeader() {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 2,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Enbu"
        sx={{ width: 92, height: 92, borderRadius: '50%', display: 'block' }}
      />
    </Box>
  );
}
