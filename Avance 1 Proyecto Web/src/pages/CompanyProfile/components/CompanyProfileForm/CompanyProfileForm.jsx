import { useState } from 'react';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

function duplicateIndexes(values) {
  const seen = new Map();
  const duplicates = new Set();
  values.forEach((value, index) => {
    const key = value.trim().toLowerCase();
    if (!key) return;
    if (seen.has(key)) {
      duplicates.add(seen.get(key));
      duplicates.add(index);
    } else {
      seen.set(key, index);
    }
  });
  return duplicates;
}

const actionButtonSx = {
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  width: 40,
  height: 40,
  '&:hover': { bgcolor: 'primary.dark' },
};

export default function CompanyProfileForm() {
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [rutEmpresa, setRutEmpresa] = useState('');
  const [correo, setCorreo] = useState('');
  const [sitioWeb, setSitioWeb] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefonos, setTelefonos] = useState(['', '']);
  const [tipos, setTipos] = useState({ productos: false, servicios: false });
  const [submitted, setSubmitted] = useState(false);

  const tipoNegocio = ['productos', 'servicios'].filter((tipo) => tipos[tipo]);
  const missingType = submitted && tipoNegocio.length === 0;
  const duplicatedPhones = duplicateIndexes(telefonos);

  function empty(value) {
    return submitted && value.trim() === '';
  }

  function updatePhone(index, value) {
    const next = [...telefonos];
    next[index] = value;
    setTelefonos(next);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log({
      nombreEmpresa: nombreEmpresa.trim(),
      rutEmpresa: rutEmpresa.trim(),
      correo: correo.trim(),
      sitioWeb: sitioWeb.trim(),
      direccion: direccion.trim(),
      telefonos: telefonos.map((telefono) => telefono.trim()),
      tipoNegocio,
    });
    setSubmitted(true);
  }

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      spacing={2.5}
      sx={{ width: '100%', maxWidth: 592, mx: 'auto' }}
    >
      <TextField
        name="nombreEmpresa"
        placeholder="Nombre Empresa"
        value={nombreEmpresa}
        onChange={(event) => setNombreEmpresa(event.target.value)}
        error={empty(nombreEmpresa)}
        helperText={empty(nombreEmpresa) ? 'Ingresa el nombre de la empresa' : undefined}
        fullWidth
        sx={{ maxWidth: 480 }}
      />
      <TextField
        name="rutEmpresa"
        placeholder="RUT Empresa"
        value={rutEmpresa}
        onChange={(event) => setRutEmpresa(event.target.value)}
        error={empty(rutEmpresa)}
        helperText={empty(rutEmpresa) ? 'Ingresa el RUT de la empresa' : undefined}
        fullWidth
        sx={{ maxWidth: 480 }}
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
        sx={{ maxWidth: 480 }}
      />
      <TextField
        name="sitioWeb"
        placeholder="Sitio Web"
        value={sitioWeb}
        onChange={(event) => setSitioWeb(event.target.value)}
        fullWidth
        sx={{ maxWidth: 480 }}
      />
      <TextField
        name="direccion"
        placeholder="Dirección Local"
        value={direccion}
        onChange={(event) => setDireccion(event.target.value)}
        fullWidth
        sx={{ maxWidth: 480 }}
      />

      {telefonos.map((value, index) => {
        const isLast = index === telefonos.length - 1;
        const canRemove = telefonos.length > 1;
        const duplicated = duplicatedPhones.has(index);
        const missing = empty(value);
        let helperText;
        if (missing) helperText = `Ingresa teléfono ${index + 1}`;
        else if (duplicated) helperText = 'Este teléfono ya está ingresado';

        return (
          <Box
            key={`telefono-${index}`}
            sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 96px', columnGap: 1 }}
          >
            <TextField
              name={`telefono-${index + 1}`}
              placeholder={`Teléfono ${index + 1}`}
              value={value}
              onChange={(event) => updatePhone(index, event.target.value)}
              error={missing || duplicated}
              helperText={helperText}
              fullWidth
            />
            <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
              {isLast ? (
                <IconButton
                  aria-label="Agregar teléfono"
                  onClick={() => setTelefonos([...telefonos, ''])}
                  sx={{ ...actionButtonSx, borderRadius: '50%' }}
                >
                  <Add />
                </IconButton>
              ) : null}
              {canRemove ? (
                <IconButton
                  aria-label={`Eliminar teléfono ${index + 1}`}
                  onClick={() => setTelefonos(telefonos.filter((_, itemIndex) => itemIndex !== index))}
                  sx={{ ...actionButtonSx, borderRadius: 1 }}
                >
                  <Delete />
                </IconButton>
              ) : null}
            </Stack>
          </Box>
        );
      })}

      <FormControl error={missingType} sx={{ alignItems: 'center', maxWidth: 480 }}>
        <FormLabel id="tipo-negocio-empresa-label">Tipo De Negocio</FormLabel>
        <FormGroup row aria-labelledby="tipo-negocio-empresa-label">
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
        Guardar Cambios
      </Button>
    </Stack>
  );
}
