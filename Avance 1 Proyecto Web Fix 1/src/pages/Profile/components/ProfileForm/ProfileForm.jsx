import { useState } from 'react';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { clampRut, rutLimitMessage } from '../../../../utils/rut/rut';

function isFutureDate(value) {
  if (!value) return false;
  const birth = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return birth > today;
}

function isAdult(value) {
  if (!value || isFutureDate(value)) return false;
  const birth = new Date(`${value}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age >= 18;
}

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

export default function ProfileForm() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefonos, setTelefonos] = useState(['', '']);
  const [direcciones, setDirecciones] = useState(['', '']);
  const [submitted, setSubmitted] = useState(false);

  const adult = isAdult(fechaNacimiento);
  const futureBirth = isFutureDate(fechaNacimiento);
  const duplicatedPhones = duplicateIndexes(telefonos);

  function empty(value) {
    return submitted && value.trim() === '';
  }

  function updateList(list, setList, index, value) {
    const next = [...list];
    next[index] = value;
    setList(next);
  }

  function addItem(list, setList) {
    setList([...list, '']);
  }

  function removeItem(list, setList, index) {
    if (list.length === 1) return;
    setList(list.filter((_, itemIndex) => itemIndex !== index));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      rut: rut.trim(),
      fechaNacimiento,
      esMayorDeEdad: adult,
      correo: correo.trim(),
      telefonos: telefonos.map((telefono) => telefono.trim()),
      direcciones: direcciones.map((direccion) => direccion.trim()),
    });
    setSubmitted(true);
  }

  function renderRepeatable(list, setList, label, addLabel) {
    return list.map((value, index) => {
      const isLast = index === list.length - 1;
      const canRemove = list.length > 1;
      const duplicated = label === 'Teléfono' && duplicatedPhones.has(index);
      const missing = empty(value);
      let helperText;
      if (missing) helperText = `Ingresa ${label.toLowerCase()} ${index + 1}`;
      else if (duplicated) helperText = 'Este teléfono ya está ingresado';

      return (
        <Box
          key={`${label}-${index}`}
          sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 96px', columnGap: 1 }}
        >
          <TextField
            name={`${label}-${index + 1}`}
            placeholder={`${label} ${index + 1}`}
            value={value}
            onChange={(event) => updateList(list, setList, index, event.target.value)}
            error={missing || duplicated}
            helperText={helperText}
            fullWidth
          />
          <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
            {isLast ? (
              <IconButton
                aria-label={addLabel}
                onClick={() => addItem(list, setList)}
                sx={{ ...actionButtonSx, borderRadius: '50%' }}
              >
                <Add />
              </IconButton>
            ) : null}
            {canRemove ? (
              <IconButton
                aria-label={`Eliminar ${label.toLowerCase()} ${index + 1}`}
                onClick={() => removeItem(list, setList, index)}
                sx={{ ...actionButtonSx, borderRadius: 1 }}
              >
                <Delete />
              </IconButton>
            ) : null}
          </Stack>
        </Box>
      );
    });
  }

  const birthHelper = empty(fechaNacimiento)
    ? 'Ingresa tu fecha de nacimiento'
    : futureBirth
      ? 'La fecha no puede ser futura'
      : fechaNacimiento && !adult
        ? 'Eres menor de edad; algunas compras pueden estar restringidas'
        : undefined;

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      spacing={2.5}
      sx={{ width: '100%', maxWidth: 592, mx: 'auto' }}
    >
      <TextField
        name="nombre"
        placeholder="Nombre"
        value={nombre}
        onChange={(event) => setNombre(event.target.value)}
        error={empty(nombre)}
        helperText={empty(nombre) ? 'Ingresa tu nombre' : undefined}
        fullWidth
        sx={{ maxWidth: 480 }}
      />
      <TextField
        name="apellido"
        placeholder="Apellido"
        value={apellido}
        onChange={(event) => setApellido(event.target.value)}
        error={empty(apellido)}
        helperText={empty(apellido) ? 'Ingresa tu apellido' : undefined}
        fullWidth
        sx={{ maxWidth: 480 }}
      />
      <TextField
        name="rut"
        placeholder="Rut"
        value={rut}
        onChange={(event) => setRut(clampRut(event.target.value))}
        error={empty(rut) || Boolean(submitted && rutLimitMessage(rut))}
        helperText={empty(rut) ? 'Ingresa tu Rut' : submitted ? rutLimitMessage(rut) || undefined : undefined}
        fullWidth
        sx={{ maxWidth: 480 }}
      />
      <TextField
        name="fechaNacimiento"
        label="Fecha De Nacimiento"
        type="date"
        value={fechaNacimiento}
        onChange={(event) => setFechaNacimiento(event.target.value)}
        error={empty(fechaNacimiento) || futureBirth}
        helperText={birthHelper}
        fullWidth
        InputLabelProps={{ shrink: true }}
        sx={{ maxWidth: 480 }}
      />
      <TextField
        name="correo"
        type="email"
        placeholder="Correo Electrónico"
        value={correo}
        onChange={(event) => setCorreo(event.target.value)}
        error={empty(correo) || (submitted && correo.trim() !== '' && !/^\S+@\S+\.\S+$/.test(correo.trim()))}
        helperText={
          empty(correo)
            ? 'Ingresa tu correo electrónico'
            : submitted && correo.trim() !== '' && !/^\S+@\S+\.\S+$/.test(correo.trim())
              ? 'Ingresa un correo válido'
              : undefined
        }
        fullWidth
        sx={{ maxWidth: 480 }}
      />

      {renderRepeatable(telefonos, setTelefonos, 'Teléfono', 'Agregar teléfono')}
      {renderRepeatable(direcciones, setDirecciones, 'Dirección', 'Agregar dirección')}

      <Button type="submit" variant="contained" sx={{ width: 280, alignSelf: 'center' }}>
        Guardar Cambios
      </Button>
    </Stack>
  );
}
