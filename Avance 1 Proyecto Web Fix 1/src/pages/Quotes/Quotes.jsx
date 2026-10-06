import { useMemo, useRef, useState } from 'react';
import Add from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Edit from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import StoreHeader from '../../components/organisms/StoreHeader/StoreHeader';
import CategoryMenu from '../Catalog/components/CategoryMenu/CategoryMenu';
import { categoryTree } from '../Catalog/data/categories';
import { products } from '../Catalog/data/products';
import { buildSeedQuotes } from './data/quotes';
import {
  displayedUnitPrice,
  expirationIso,
  formatChileanDate,
  formatIso,
  shouldDeleteQuote,
} from './quoteRules/quoteRules';

const estados = ['Solicitada', 'Respondida', 'Aceptada Por El Cliente', 'Expirada'];

function idsOf(node) {
  return [node.id, ...(node.children || []).flatMap(idsOf)];
}

const serviceIds = new Set(idsOf(categoryTree.find((node) => node.id === 'servicios')));

function isService(product) {
  return serviceIds.has(product.categoryId);
}

function formatPrice(value) {
  return `$ ${Number(value).toLocaleString('es-CL')}`;
}

function productById(id) {
  return products.find((product) => product.id === id);
}

export default function Quotes() {
  const today = formatIso(new Date());
  const nextKey = useRef(10);
  const [quotes, setQuotes] = useState(() =>
    buildSeedQuotes().filter((quote) => !shouldDeleteQuote(quote.fecha, today)),
  );
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fecha, setFecha] = useState(today);
  const [estado, setEstado] = useState('Solicitada');
  const [rows, setRows] = useState(() => [blankRow('item'), blankRow('item'), blankRow('item')]);
  const [descuento, setDescuento] = useState('');
  const [solicitudDescuento, setSolicitudDescuento] = useState('');
  const [notas, setNotas] = useState('');
  const [tab, setTab] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function blankRow(tipo) {
    nextKey.current += 1;
    return {
      key: `row-${nextKey.current}`,
      tipo,
      productId: '',
      observacion: '',
      cantidad: 1,
      precioUnitario: 0,
    };
  }

  const allowedCategories = useMemo(() => {
    if (!categoryId) return null;
    const node = findNode(categoryTree, categoryId);
    return node ? new Set(idsOf(node)) : null;
  }, [categoryId]);

  const lines = rows.map((row) => {
    const product = productById(row.productId);
    const current = product ? product.price : 0;
    const unit = row.productId ? displayedUnitPrice(row.precioUnitario || current, current, fecha, today) : 0;
    const cantidad = Number(row.cantidad) || 0;
    return {
      ...row,
      nombre: product ? product.name : '',
      unit,
      total: unit * cantidad,
      adjusted: Boolean(row.productId) && unit !== (row.precioUnitario || current),
    };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
  const discountValue = descuento.trim() === '' ? 0 : Number(descuento);
  const total = Math.max(0, subtotal - (Number.isFinite(discountValue) ? discountValue : 0));
  const vencimiento = formatChileanDate(expirationIso(fecha));
  const noItem = lines.every((line) => !line.productId);
  const badDiscount = !Number.isFinite(discountValue) || discountValue < 0 || discountValue > subtotal;
  const missingItem = submitted && noItem;
  const discountError = submitted && badDiscount;

  const visibleQuotes = quotes.filter((quote) => {
    const text = query.trim().toLowerCase();
    const names = quote.items.map((item) => productById(item.productId)?.name || '').join(' ');
    const matchesText = !text || names.toLowerCase().includes(text) || quote.notas.toLowerCase().includes(text);
    const matchesCategory =
      !allowedCategories ||
      quote.items.some((item) => allowedCategories.has(productById(item.productId)?.categoryId));
    return matchesText && matchesCategory;
  });

  function optionsFor(tipo) {
    return products.filter((product) => {
      const kindOk = tipo === 'item' || (tipo === 'servicio' ? isService(product) : !isService(product));
      const categoryOk = !allowedCategories || allowedCategories.has(product.categoryId);
      return kindOk && categoryOk;
    });
  }

  function updateRow(key, patch) {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function resetForm() {
    setEditingId(null);
    setFecha(today);
    setEstado('Solicitada');
    setRows([blankRow('item'), blankRow('item'), blankRow('item')]);
    setDescuento('');
    setSolicitudDescuento('');
    setNotas('');
    setSubmitted(false);
    setTab(0);
  }

  function loadQuote(quote) {
    setEditingId(quote.id);
    setFecha(quote.fecha);
    setEstado(quote.estado);
    setRows(quote.items.map((item) => ({ ...item })));
    setDescuento(quote.descuento ? String(quote.descuento) : '');
    setSolicitudDescuento(quote.solicitudDescuento);
    setNotas(quote.notas);
    setSubmitted(false);
  }

  function handleSave(event) {
    event.preventDefault();
    const id = editingId ?? quotes.reduce((max, quote) => Math.max(max, quote.id), 0) + 1;
    const payload = {
      id,
      fecha,
      fechaVencimiento: expirationIso(fecha),
      estado,
      items: lines
        .filter((line) => line.productId)
        .map((line) => ({
          tipo: line.tipo,
          productId: line.productId,
          descripcion: line.nombre,
          observacion: line.observacion.trim(),
          cantidad: Number(line.cantidad),
          precioUnitario: line.unit,
          total: line.total,
        })),
      descuento: discountValue,
      solicitudDescuento: solicitudDescuento.trim(),
      notas: notas.trim(),
      subtotal,
      total,
    };
    console.log(payload);
    setSubmitted(true);
    const invalidQuantity = lines.some(
      (line) => line.productId && (!Number.isInteger(Number(line.cantidad)) || Number(line.cantidad) < 1),
    );
    if (noItem || badDiscount || invalidQuantity) return;

    const stored = {
      id,
      fecha,
      estado,
      items: lines
        .filter((line) => line.productId)
        .map((line) => ({
          key: line.key,
          tipo: line.tipo,
          productId: line.productId,
          observacion: line.observacion.trim(),
          cantidad: Number(line.cantidad),
          precioUnitario: editingId ? line.precioUnitario || line.unit : line.unit,
        })),
      descuento: discountValue,
      solicitudDescuento: solicitudDescuento.trim(),
      notas: notas.trim(),
    };
    setQuotes((current) => {
      if (editingId) return current.map((quote) => (quote.id === editingId ? stored : quote));
      return [...current, stored];
    });
    resetForm();
  }

  const summary = lines
    .filter((line) => line.productId)
    .map((line) => `${line.nombre} x ${line.cantidad} = ${formatPrice(line.total)}`)
    .join('\n');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <StoreHeader query={query} onQueryChange={setQuery} onOpenCategories={() => setMenuOpen(true)} />
      <Typography variant="h4" align="center" sx={{ py: 3 }}>
        Cotizaciones
      </Typography>
      <Box
        component="form"
        onSubmit={handleSave}
        sx={{ bgcolor: 'background.paper', mx: { xs: 2, md: 4 }, p: { xs: 2, md: 3 }, borderRadius: 2 }}
      >
        <TextField
          select
          label="Estado"
          value={estado}
          onChange={(event) => setEstado(event.target.value)}
          SelectProps={{ native: true }}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, minWidth: 280 }}
        >
          {estados.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </TextField>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              {['Ítem', 'Descripción', 'Observación', 'Cantidad', 'Fecha Venc.', 'Total', ''].map((header) => (
                <TableCell key={header || 'quitar'} sx={{ fontWeight: 700, color: 'primary.contrastText' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {lines.map((line, index) => (
              <TableRow key={line.key}>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ minWidth: 180 }}>
                  <TextField
                    select
                    value={line.productId}
                    onChange={(event) => {
                      const product = productById(event.target.value);
                      updateRow(line.key, {
                        productId: event.target.value,
                        precioUnitario: product ? product.price : 0,
                      });
                    }}
                    SelectProps={{ native: true }}
                    inputProps={{ 'aria-label': `Descripción ${index + 1}` }}
                    fullWidth
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { minHeight: 40 } }}
                  >
                    <option value="">Seleccione</option>
                    {optionsFor(line.tipo).map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell sx={{ minWidth: 160 }}>
                  <TextField
                    value={line.observacion}
                    placeholder="Observación"
                    onChange={(event) => updateRow(line.key, { observacion: event.target.value })}
                    inputProps={{ 'aria-label': `Observación ${index + 1}` }}
                    fullWidth
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { minHeight: 40 } }}
                  />
                </TableCell>
                <TableCell sx={{ width: 110 }}>
                  <TextField
                    type="number"
                    value={line.cantidad}
                    onChange={(event) => updateRow(line.key, { cantidad: event.target.value })}
                    inputProps={{ 'aria-label': `Cantidad ${index + 1}`, min: 1 }}
                    fullWidth
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { minHeight: 40 } }}
                  />
                </TableCell>
                <TableCell>{vencimiento}</TableCell>
                <TableCell>
                  {formatPrice(line.total)}
                  {line.adjusted ? (
                    <Typography variant="caption" display="block">
                      Precio Ajustado
                    </Typography>
                  ) : null}
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label={`Quitar ítem ${index + 1}`}
                    disabled={rows.length === 1}
                    onClick={() => setRows((current) => current.filter((row) => row.key !== line.key))}
                  >
                    <Close />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {missingItem ? (
          <Typography color="error" sx={{ mt: 1 }}>
            Elige al menos un producto o servicio
          </Typography>
        ) : null}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
          <Button type="button" variant="contained" startIcon={<Add />} onClick={() => setRows((current) => [...current, blankRow('producto')])} sx={{ minHeight: 44 }}>
            Agregar Producto
          </Button>
          <Button type="button" variant="contained" startIcon={<Add />} onClick={() => setRows((current) => [...current, blankRow('servicio')])} sx={{ minHeight: 44 }}>
            Agregar Servicio
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 360px' }}>
            <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ '& .MuiTab-root': { textTransform: 'none' } }}>
              <Tab label="Resumen De Costo" />
              <Tab label="Solicitar Descuento" />
              <Tab label="Notas Adicionales" />
            </Tabs>
            {tab === 0 ? (
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, minHeight: 140, p: 2, whiteSpace: 'pre-wrap' }}>
                {summary}
              </Box>
            ) : null}
            {tab === 1 ? (
              <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
                <TextField
                  label="Monto Del Descuento"
                  value={descuento}
                  onChange={(event) => setDescuento(event.target.value)}
                  error={discountError}
                  helperText={discountError ? 'El descuento no puede superar el subtotal' : undefined}
                />
                <TextField
                  label="Solicitud"
                  value={solicitudDescuento}
                  onChange={(event) => setSolicitudDescuento(event.target.value)}
                  multiline
                  minRows={3}
                />
              </Box>
            ) : null}
            {tab === 2 ? (
              <TextField
                label="Notas"
                value={notas}
                onChange={(event) => setNotas(event.target.value)}
                multiline
                minRows={4}
                fullWidth
                sx={{ mt: 2 }}
              />
            ) : null}
          </Box>
          <Box sx={{ minWidth: 220, ml: 'auto', textAlign: 'right' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
              <Typography>Subtotal</Typography>
              <Typography>{formatPrice(subtotal)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mt: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h5">{formatPrice(total)}</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
          {editingId ? (
            <Button type="button" onClick={resetForm} sx={{ minHeight: 48 }}>
              Nueva Cotización
            </Button>
          ) : null}
          <Button type="submit" variant="contained" sx={{ minHeight: 48 }}>
            Guardar Cotización
          </Button>
        </Box>
      </Box>

      <Typography variant="h5" align="center" sx={{ mt: 4, mb: 2 }}>
        Cotizaciones Guardadas
      </Typography>
      <Box sx={{ px: { xs: 2, md: 4 }, pb: 6 }}>
        <Table sx={{ bgcolor: 'background.paper' }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              {['ID', 'Fecha', 'Estado', 'Ítems', 'Total', 'Acciones'].map((header) => (
                <TableCell key={header} sx={{ fontWeight: 700, color: 'primary.contrastText' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Hay Resultados
                </TableCell>
              </TableRow>
            ) : (
              visibleQuotes.map((quote) => {
                const quoteLines = quote.items.map((item) => {
                  const product = productById(item.productId);
                  const unit = displayedUnitPrice(item.precioUnitario, product?.price ?? item.precioUnitario, quote.fecha, today);
                  return { ...item, nombre: product?.name || '', unit, total: unit * item.cantidad, adjusted: unit !== item.precioUnitario };
                });
                const quoteTotal = Math.max(0, quoteLines.reduce((sum, item) => sum + item.total, 0) - (quote.descuento || 0));
                return (
                  <TableRow key={quote.id}>
                    <TableCell>{quote.id}</TableCell>
                    <TableCell>{formatChileanDate(quote.fecha)}</TableCell>
                    <TableCell>{quote.estado}</TableCell>
                    <TableCell>{quoteLines.map((item) => item.nombre).join(', ')}</TableCell>
                    <TableCell>
                      {formatPrice(quoteTotal)}
                      {quoteLines.some((item) => item.adjusted) ? (
                        <Typography variant="caption" display="block">
                          Precio Ajustado
                        </Typography>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <IconButton aria-label={`Editar cotización ${quote.id}`} onClick={() => loadQuote(quote)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        aria-label={`Eliminar cotización ${quote.id}`}
                        onClick={() => {
                          setPendingDelete(quote);
                          setDeleteOpen(true);
                        }}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>
      <CategoryMenu
        open={menuOpen}
        selectedId={categoryId}
        onClose={() => setMenuOpen(false)}
        onSelect={(id) => {
          setCategoryId(id);
          setMenuOpen(false);
        }}
      />
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { minWidth: { sm: 480 } } }}
        TransitionProps={{ onExited: () => setPendingDelete(null) }}
      >
        <DialogTitle>Eliminar Cotización</DialogTitle>
        <DialogContent>
          <DialogContentText>{`¿Eliminar la cotización ${pendingDelete?.id}?`}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteOpen(false)}
            sx={{ minHeight: 48, color: 'text.primary', borderColor: 'action.active' }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            sx={{ minHeight: 48 }}
            onClick={() => {
              setQuotes((current) => current.filter((quote) => quote.id !== pendingDelete.id));
              if (editingId === pendingDelete.id) resetForm();
              setDeleteOpen(false);
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = node.children && findNode(node.children, id);
    if (found) return found;
  }
  return null;
}
