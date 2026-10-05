import Box from '@mui/material/Box';
import logo from '../../assets/logo.png';

export default function BrandPanel() {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: { xs: '0 0 auto', md: '0 0 36.18%' },
        py: { xs: 5, md: 0 },
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Enbu"
        sx={{
          width: { xs: 220, md: '65%' },
          maxWidth: 339,
          height: 'auto',
          borderRadius: '50%',
          display: 'block',
        }}
      />
    </Box>
  );
}
