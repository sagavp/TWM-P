import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { clampRut, rutLimitMessage } from '../../utils/rut/rut';

export default function LoginForm() {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('cliente');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const rutEmpty = submitted && rut.trim() === '';
  const rutFormat = submitted ? rutLimitMessage(rut) : '';
  const rutError = rutEmpty || Boolean(rutFormat);
  const passwordError = submitted && password.trim() === '';

  function handleSubmit(event) {
    event.preventDefault();
    const payload = { rut: rut.trim(), password, remember, role };
    console.log(payload);
    setSubmitted(true);
    if (payload.rut && !rutLimitMessage(payload.rut) && password.trim()) {
      navigate(role === 'emprendedor' ? '/gestion' : '/catalogo');
    }
  }

  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: { xs: 5, md: 6 },
      }}
    >
      <Stack
        component="form"
        onSubmit={handleSubmit}
        spacing={0}
        sx={{ width: '100%', maxWidth: 544 }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 6 }}>
          Inicia Sesión
        </Typography>

        <TextField
          name="rut"
          placeholder="Rut"
          value={rut}
          onChange={(event) => setRut(clampRut(event.target.value))}
          error={rutError}
          helperText={rutEmpty ? 'Ingresa tu Rut' : rutFormat || undefined}
          fullWidth
          autoComplete="username"
          sx={{ mb: 4 }}
        />

        <TextField
          name="password"
          placeholder="Contraseña"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={passwordError}
          helperText={passwordError ? 'Ingresa tu contraseña' : undefined}
          fullWidth
          autoComplete="current-password"
          sx={{ mb: 1.5 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowPassword((visible) => !visible)}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
          }
          label="Recuérdame"
          sx={{ mb: 2, ml: 0.5 }}
        />

        <FormControl sx={{ mb: 3 }}>
          <FormLabel>Ingresar Como</FormLabel>
          <RadioGroup row value={role} onChange={(event) => setRole(event.target.value)}>
            <FormControlLabel value="cliente" control={<Radio />} label="Cliente" />
            <FormControlLabel value="emprendedor" control={<Radio />} label="Emprendedor" />
          </RadioGroup>
        </FormControl>

        <Button type="submit" variant="contained" fullWidth sx={{ mb: 4 }}>
          Iniciar Sesión
        </Button>

        <Link
          component={RouterLink}
          to="/registro"
          underline="none"
          color="text.primary"
          align="center"
        >
          Crear Cuenta
        </Link>
      </Stack>
    </Box>
  );
}
