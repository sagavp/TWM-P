import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const emptyMessage = {
  nombre: 'Ingresa tu nombre',
  apellido: 'Ingresa tu apellido',
  rut: 'Ingresa tu Rut',
  correo: 'Ingresa tu correo electrónico',
  password: 'Ingresa tu contraseña',
  confirmPassword: 'Confirma tu contraseña',
};

export default function RegisterForm() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const confirmEmpty = submitted && confirmPassword.trim() === '';
  const mismatch = submitted && !confirmEmpty && password !== confirmPassword;

  function handleSubmit(event) {
    event.preventDefault();
    console.log({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      rut: rut.trim(),
      correo: correo.trim(),
      password,
      confirmPassword,
    });
    setSubmitted(true);
  }

  function passwordAdornment(visible, setVisible, label) {
    return (
      <InputAdornment position="end">
        <IconButton
          aria-label={visible ? `Ocultar ${label}` : `Mostrar ${label}`}
          onClick={() => setVisible((current) => !current)}
          edge="end"
        >
          {visible ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    );
  }

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      spacing={2.5}
      sx={{ width: '100%', maxWidth: 480, mx: 'auto' }}
    >
      <TextField
        name="nombre"
        placeholder="Nombre"
        value={nombre}
        onChange={(event) => setNombre(event.target.value)}
        error={submitted && nombre.trim() === ''}
        helperText={submitted && nombre.trim() === '' ? emptyMessage.nombre : undefined}
        fullWidth
        autoComplete="given-name"
      />
      <TextField
        name="apellido"
        placeholder="Apellido"
        value={apellido}
        onChange={(event) => setApellido(event.target.value)}
        error={submitted && apellido.trim() === ''}
        helperText={submitted && apellido.trim() === '' ? emptyMessage.apellido : undefined}
        fullWidth
        autoComplete="family-name"
      />
      <TextField
        name="rut"
        placeholder="Rut"
        value={rut}
        onChange={(event) => setRut(event.target.value)}
        error={submitted && rut.trim() === ''}
        helperText={submitted && rut.trim() === '' ? emptyMessage.rut : undefined}
        fullWidth
      />
      <TextField
        name="correo"
        type="email"
        placeholder="Correo Electrónico"
        value={correo}
        onChange={(event) => setCorreo(event.target.value)}
        error={submitted && correo.trim() === ''}
        helperText={submitted && correo.trim() === '' ? emptyMessage.correo : undefined}
        fullWidth
        autoComplete="email"
      />
      <TextField
        name="password"
        placeholder="Contraseña"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={submitted && password.trim() === ''}
        helperText={submitted && password.trim() === '' ? emptyMessage.password : undefined}
        fullWidth
        autoComplete="new-password"
        InputProps={{
          endAdornment: passwordAdornment(showPassword, setShowPassword, 'contraseña'),
        }}
      />
      <TextField
        name="confirmPassword"
        placeholder="Confirmar Contraseña"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        error={confirmEmpty || mismatch}
        helperText={
          confirmEmpty ? emptyMessage.confirmPassword : mismatch ? 'Las contraseñas no coinciden' : undefined
        }
        fullWidth
        autoComplete="new-password"
        InputProps={{
          endAdornment: passwordAdornment(
            showConfirmPassword,
            setShowConfirmPassword,
            'confirmación',
          ),
        }}
      />

      <Button type="submit" variant="contained" sx={{ width: 280, alignSelf: 'center' }}>
        Registrarse
      </Button>

      <Link
        component={RouterLink}
        to="/registro-empresa"
        underline="none"
        color="text.primary"
        align="center"
      >
        ¿Eres Empresa?
      </Link>
    </Stack>
  );
}
