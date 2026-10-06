import { useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { categoryTree } from '../../../Catalog/data/categories';

function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = node.children && findNode(node.children, id);
    if (found) return found;
  }
  return null;
}

function flatten(node, trail = []) {
  const path = [...trail, node.label];
  return [
    { id: node.id, label: path.join(' / ') },
    ...(node.children || []).flatMap((child) => flatten(child, path)),
  ];
}

function categoryOptions(tipo) {
  const branch = findNode(categoryTree, tipo === 'servicio' ? 'servicios' : 'productos');
  return (branch?.children || []).flatMap((child) => flatten(child));
}

function toForm(listing) {
  return {
    tipo: listing?.tipo || 'producto',
    nombre: listing?.nombre || '',
    categoriaId: listing?.categoriaId || '',
    estado: listing?.estado || 'Publicado',
    precioBase: listing?.precioBase || listing?.precioBase === 0 ? String(listing.precioBase) : '',
    sku: listing?.sku || '',
    tamano: listing?.tamano || '',
    peso: listing?.peso || '',
    color: listing?.color || '',
    material: listing?.material || '',
    stock: listing?.stock || listing?.stock === 0 ? String(listing.stock) : '',
    restriccionEdad: Boolean(listing?.restriccionEdad),
    tiempo: listing?.tiempo || '',
    precioOferta: listing?.precioOferta ? String(listing.precioOferta) : '',
    ofertaInicio: listing?.ofertaInicio || '',
    ofertaFin: listing?.ofertaFin || '',
  };
}

function ListingForm({ listing, onClose, onSave }) {
  const [form, setForm] = useState(() => toForm(listing));
  const [submitted, setSubmitted] = useState(false);
  const options = categoryOptions(form.tipo);
  const product = form.tipo === 'producto';

  function setField(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === 'tipo' && !categoryOptions(value).some((option) => option.id === current.categoriaId)) {
        next.categoriaId = '';
      }
      return next;
    });
  }

  function missing(value) {
    return submitted && String(value).trim() === '';
  }

  function handleSubmit(event) {
    event.preventDefault();
    const precioBase = Number(form.precioBase);
    const precioOferta = form.precioOferta.trim() === '' ? '' : Number(form.precioOferta);
    const stock = form.stock.trim() === '' ? '' : Number(form.stock);
    const payload = {
      id: listing?.id ?? null,
      tipo: form.tipo,
      nombre: form.nombre.trim(),
      categoriaId: form.categoriaId,
      estado: form.estado,
      precioBase,
      sku: product ? form.sku.trim() : '',
      tamano: product ? form.tamano.trim() : '',
      peso: product ? form.peso.trim() : '',
      color: product ? form.color.trim() : '',
      material: product ? form.material.trim() : '',
      stock: product ? stock : '',
      restriccionEdad: product ? false : form.restriccionEdad,
      tiempo: product ? '' : form.tiempo.trim(),
      precioOferta,
      ofertaInicio: form.precioOferta.trim() === '' ? '' : form.ofertaInicio,
      ofertaFin: form.precioOferta.trim() === '' ? '' : form.ofertaFin,
    };
    console.log(payload);
    setSubmitted(true);
    const offerIncomplete = payload.precioOferta !== '' && (!payload.ofertaInicio || !payload.ofertaFin);
    const invalidPrice = !Number.isFinite(precioBase) || precioBase < 0;
    const invalidStock = product && (!Number.isInteger(stock) || stock < 0);
    const invalidOffer = payload.precioOferta !== '' && (!Number.isFinite(precioOferta) || precioOferta < 0);
    const invalid =
      !payload.nombre ||
      !payload.categoriaId ||
      invalidPrice ||
      offerIncomplete ||
      invalidOffer ||
      invalidStock ||
      (product && (!payload.sku || !payload.tamano || !payload.peso || !payload.color || !payload.material)) ||
      (!product && !payload.tiempo);
    if (!invalid) onSave(payload);
  }

  const offerError = submitted && form.precioOferta.trim() !== '' && (!form.ofertaInicio || !form.ofertaFin);

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2}>
      <RadioGroup row value={form.tipo} onChange={(event) => setField('tipo', event.target.value)}>
        <FormControlLabel value="producto" control={<Radio />} label="Producto" />
        <FormControlLabel value="servicio" control={<Radio />} label="Servicio" />
      </RadioGroup>
      <TextField
        label="Nombre"
        value={form.nombre}
        onChange={(event) => setField('nombre', event.target.value)}
        error={missing(form.nombre)}
        helperText={missing(form.nombre) ? 'Ingresa el nombre' : undefined}
        fullWidth
      />
      <TextField
        select
        label="Categoría"
        value={form.categoriaId}
        onChange={(event) => setField('categoriaId', event.target.value)}
        error={missing(form.categoriaId)}
        helperText={missing(form.categoriaId) ? 'Elige una categoría' : undefined}
        SelectProps={{ native: true }}
        InputLabelProps={{ shrink: true }}
        fullWidth
      >
        <option value="">Categoría</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </TextField>
      <TextField
        select
        label="Estado"
        value={form.estado}
        onChange={(event) => setField('estado', event.target.value)}
        SelectProps={{ native: true }}
        InputLabelProps={{ shrink: true }}
        fullWidth
      >
        <option value="Publicado">Publicado</option>
        <option value="Pausado">Pausado</option>
      </TextField>
      <TextField
        label="Precio Base"
        value={form.precioBase}
        onChange={(event) => setField('precioBase', event.target.value)}
        error={missing(form.precioBase)}
        helperText={missing(form.precioBase) ? 'Ingresa el precio base' : undefined}
        fullWidth
      />
      {product ? (
        <>
          <TextField
            label="SKU"
            value={form.sku}
            onChange={(event) => setField('sku', event.target.value)}
            error={missing(form.sku)}
            helperText={missing(form.sku) ? 'Ingresa el SKU' : undefined}
            fullWidth
          />
          <TextField
            label="Tamaño"
            value={form.tamano}
            onChange={(event) => setField('tamano', event.target.value)}
            error={missing(form.tamano)}
            helperText={missing(form.tamano) ? 'Ingresa el tamaño' : undefined}
            fullWidth
          />
          <TextField
            label="Peso"
            value={form.peso}
            onChange={(event) => setField('peso', event.target.value)}
            error={missing(form.peso)}
            helperText={missing(form.peso) ? 'Ingresa el peso' : undefined}
            fullWidth
          />
          <TextField
            label="Color"
            value={form.color}
            onChange={(event) => setField('color', event.target.value)}
            error={missing(form.color)}
            helperText={missing(form.color) ? 'Ingresa el color' : undefined}
            fullWidth
          />
          <TextField
            label="Material Principal"
            value={form.material}
            onChange={(event) => setField('material', event.target.value)}
            error={missing(form.material)}
            helperText={missing(form.material) ? 'Ingresa el material principal' : undefined}
            fullWidth
          />
          <TextField
            label="Stock"
            value={form.stock}
            onChange={(event) => setField('stock', event.target.value)}
            error={missing(form.stock)}
            helperText={missing(form.stock) ? 'Ingresa el stock' : undefined}
            fullWidth
          />
        </>
      ) : (
        <>
          <TextField
            label="Tiempo"
            value={form.tiempo}
            onChange={(event) => setField('tiempo', event.target.value)}
            error={missing(form.tiempo)}
            helperText={missing(form.tiempo) ? 'Ingresa el tiempo' : undefined}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.restriccionEdad}
                onChange={(event) => setField('restriccionEdad', event.target.checked)}
              />
            }
            label="Solo Mayores De Edad"
          />
        </>
      )}
      <TextField
        label="Precio Oferta"
        value={form.precioOferta}
        onChange={(event) => setField('precioOferta', event.target.value)}
        fullWidth
      />
      <TextField
        label="Inicio De Oferta"
        type="date"
        value={form.ofertaInicio}
        onChange={(event) => setField('ofertaInicio', event.target.value)}
        error={offerError}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <TextField
        label="Fin De Oferta"
        type="date"
        value={form.ofertaFin}
        onChange={(event) => setField('ofertaFin', event.target.value)}
        error={offerError}
        helperText={offerError ? 'Indica el inicio y el fin de la oferta' : undefined}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <DialogActions sx={{ px: 0 }}>
        <Button onClick={onClose} sx={{ minHeight: 48 }}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" sx={{ minHeight: 48 }}>
          Guardar
        </Button>
      </DialogActions>
    </Stack>
  );
}

export default function ListingDialog({ open, listing, onClose, onExited, onSave }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" TransitionProps={{ onExited }}>
      <DialogTitle>{listing?.id ? 'Editar Registro' : 'Agregar Registro'}</DialogTitle>
      <DialogContent>
        {open ? <ListingForm key={listing?.id ?? 'new'} listing={listing} onClose={onClose} onSave={onSave} /> : null}
      </DialogContent>
    </Dialog>
  );
}
