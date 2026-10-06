import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import Search from '@mui/icons-material/Search';
import logo from '../../../assets/logo.png';

export default function StoreHeader({ query, onQueryChange, onOpenCategories, onSearchSubmit }) {
  const [anchor, setAnchor] = useState(null);

  return (
    <Box
      component="header"
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, md: 2 },
        px: { xs: 1.5, md: 3 },
        py: 1.5,
      }}
    >
      <Box component={RouterLink} to="/catalogo" sx={{ display: 'flex', flexShrink: 0 }}>
        <Box
          component="img"
          src={logo}
          alt="Enbu"
          sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'background.paper' }}
        />
      </Box>

      <ButtonBase
        onClick={onOpenCategories}
        aria-label="Abrir categorías"
        sx={{ color: 'inherit', gap: 1, px: 1, borderRadius: 2, flexShrink: 0 }}
      >
        <MenuIcon />
        <Typography sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>Categorías</Typography>
      </ButtonBase>

      <TextField
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && onSearchSubmit) onSearchSubmit();
        }}
        placeholder="Buscar"
        fullWidth
        inputProps={{ 'aria-label': 'Buscar' }}
        sx={{
          maxWidth: 560,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            borderRadius: 999,
            minHeight: 52,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <ButtonBase
          aria-haspopup="true"
          aria-expanded={Boolean(anchor)}
          onClick={(event) => setAnchor(event.currentTarget)}
          sx={{ color: 'inherit', gap: 0.5, px: 1, borderRadius: 2 }}
        >
          <Typography sx={{ fontWeight: 600 }}>Mi Cuenta</Typography>
          <ExpandMore />
        </ButtonBase>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          <MenuItem component={RouterLink} to="/gestion" onClick={() => setAnchor(null)}>
            Gestión
          </MenuItem>
          <MenuItem component={RouterLink} to="/cotizaciones" onClick={() => setAnchor(null)}>
            Cotizaciones
          </MenuItem>
          <MenuItem component={RouterLink} to="/perfil" onClick={() => setAnchor(null)}>
            Mi Perfil
          </MenuItem>
          <MenuItem component={RouterLink} to="/perfil-empresa" onClick={() => setAnchor(null)}>
            Perfil De Empresa
          </MenuItem>
          <MenuItem component={RouterLink} to="/" onClick={() => setAnchor(null)}>
            Cerrar Sesión
          </MenuItem>
        </Menu>
        <Avatar sx={{ bgcolor: 'background.paper', color: 'primary.main', width: 56, height: 56, fontWeight: 700 }}>
          C
        </Avatar>
        <Typography sx={{ fontWeight: 500, display: { xs: 'none', md: 'block' } }}>Hola, Cliente</Typography>
      </Box>
    </Box>
  );
}
