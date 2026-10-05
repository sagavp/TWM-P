import { useState } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function CompanyRegisterForm() {
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [rutEmpresa, setRutEmpresa] = useState('');
  const [correo, setCorreo] = useState('');
  const [sitioWeb, setSitioWeb] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [emprendedorNombre, setEmprendedorNombre] = useState('');
  const [emprendedorRun, setEmprendedorRun] = useState('');
  const [emprendedorTelefono, setEmprendedorTelefono] = useState('');
  const [emprendedorCorreo, setEmprendedorCorreo] = useState('');
  const [emprendedorDireccion, setEmprendedorDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tipos, setTipos] = useState({ productos: false, servicios: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const confirmEmpty = submitted && confirmPassword.trim() === '';
  const mismatch = submitted && !confirmEmpty && password !== confirmPassword;
  const tipoNegocio = ['productos', 'servicios'].filter((tipo) => tipos[tipo]);
  const missingType = submitted && tipoNegocio.length === 0;

  function empty(value) {
    return submitted && value.trim() === '';
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log({
      nombreEmpresa: nombreEmpresa.trim(),
      rutEmpresa: rutEmpresa.trim(),
      correo: correo.trim(),
      sitioWeb: sitioWeb.trim(),
      direccion: direccion.trim(),
      telefono: telefono.trim(),
      password,
      confirmPassword,
      tipoNegocio,
      emprendedor: {
        nombre: emprendedorNombre.trim(),
        run: emprendedorRun.trim(),
        telefono: emprendedorTelefono.trim(),
        correo: emprendedorCorreo.trim(),
        direccion: emprendedorDireccion.trim(),
      },
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
        name="nombreEmpresa"
        placeholder="Nombre Empresa"
        value={nombreEmpresa}
        onChange={(event) => setNombreEmpresa(event.target.value)}
        error={empty(nombreEmpresa)}
        helperText={empty(nombreEmpresa) ? 'Ingresa el nombre de la empresa' : undefined}
        fullWidth
      />
      <TextField
        name="rutEmpresa"
        placeholder="RUT Empresa"
        value={rutEmpresa}
        onChange={(event) => setRutEmpresa(event.target.value)}
        error={empty(rutEmpresa)}
        helperText={empty(rutEmpresa) ? 'Ingresa el RUT de la empresa' : undefined}
        fullWidth
      />
      <TextField
        name="correo"
        type="email"
        placeholder="Correo Empresa"
        value={correo}
        onChange={(event) => setCorreo(event.target.value)}
        error={empty(correo)}
        helperText={empty(correo) ? 'Ingresa el correo de la empresa' : undefined}
        fullWidth
        autoComplete="email"
      />
      <TextField
        name="sitioWeb"
        placeholder="Sitio Web"
        value={sitioWeb}
        onChange={(event) => setSitioWeb(event.target.value)}
        fullWidth
      />
      <TextField
        name="direccion"
        placeholder="Dirección Local"
        value={direccion}
        onChange={(event) => setDireccion(event.target.value)}
        fullWidth
      />
      <TextField
        name="telefono"
        placeholder="Teléfono"
        value={telefono}
        onChange={(event) => setTelefono(event.target.value)}
        error={empty(telefono)}
        helperText={empty(telefono) ? 'Ingresa el teléfono de la empresa' : undefined}
        fullWidth
      />

      <Typography variant="h6" align="center" sx={{ pt: 1 }}>
        Datos Del Emprendedor
      </Typography>
      <TextField
        name="emprendedorNombre"
        placeholder="Nombre Del Emprendedor"
        value={emprendedorNombre}
        onChange={(event) => setEmprendedorNombre(event.target.value)}
        error={empty(emprendedorNombre)}
        helperText={empty(emprendedorNombre) ? 'Ingresa el nombre del emprendedor' : undefined}
        fullWidth
      />
      <TextField
        name="emprendedorRun"
        placeholder="RUN Del Emprendedor"
        value={emprendedorRun}
        onChange={(event) => setEmprendedorRun(event.target.value)}
        error={empty(emprendedorRun)}
        helperText={empty(emprendedorRun) ? 'Ingresa el RUN del emprendedor' : undefined}
        fullWidth
      />
      <TextField
        name="emprendedorTelefono"
        placeholder="Teléfono Del Emprendedor"
        value={emprendedorTelefono}
        onChange={(event) => setEmprendedorTelefono(event.target.value)}
        error={empty(emprendedorTelefono)}
        helperText={empty(emprendedorTelefono) ? 'Ingresa el teléfono del emprendedor' : undefined}
        fullWidth
      />
      <TextField
        name="emprendedorCorreo"
        type="email"
        placeholder="Correo Del Emprendedor"
        value={emprendedorCorreo}
        onChange={(event) => setEmprendedorCorreo(event.target.value)}
        error={empty(emprendedorCorreo)}
        helperText={empty(emprendedorCorreo) ? 'Ingresa el correo del emprendedor' : undefined}
        fullWidth
      />
      <TextField
        name="emprendedorDireccion"
        placeholder="Dirección Del Emprendedor"
        value={emprendedorDireccion}
        onChange={(event) => setEmprendedorDireccion(event.target.value)}
        error={empty(emprendedorDireccion)}
        helperText={empty(emprendedorDireccion) ? 'Ingresa la dirección del emprendedor' : undefined}
        fullWidth
      />

      <TextField
        name="password"
        placeholder="Contraseña"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={empty(password)}
        helperText={empty(password) ? 'Ingresa tu contraseña' : undefined}
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
          confirmEmpty ? 'Confirma tu contraseña' : mismatch ? 'Las contraseñas no coinciden' : undefined
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

      <FormControl error={missingType} sx={{ alignItems: 'center' }}>
        <FormLabel id="tipo-negocio-label">Tipo De Negocio</FormLabel>
        <FormGroup row aria-labelledby="tipo-negocio-label">
          <FormControlLabel
            control={
              <Checkbox
                checked={tipos.productos}
                onChange={(event) =>
                  setTipos((current) => ({ ...current, productos: event.target.checked }))
                }
              />
            }
            label="Productos"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={tipos.servicios}
                onChange={(event) =>
                  setTipos((current) => ({ ...current, servicios: event.target.checked }))
                }
              />
            }
            label="Servicios"
          />
        </FormGroup>
        {missingType ? <FormHelperText>Elige al menos un tipo de negocio</FormHelperText> : null}
      </FormControl>

      <Button type="submit" variant="contained" sx={{ width: 280, alignSelf: 'center' }}>
        Registrarse
      </Button>
    </Stack>
  );
}
