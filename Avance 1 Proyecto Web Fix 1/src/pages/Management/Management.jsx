import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Add from '@mui/icons-material/Add';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Edit from '@mui/icons-material/Edit';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SwapVert from '@mui/icons-material/SwapVert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import StoreHeader from '../../components/organisms/StoreHeader/StoreHeader';
import CategoryMenu from '../Catalog/components/CategoryMenu/CategoryMenu';
import { categoryTree } from '../Catalog/data/categories';
import ListingDialog from './components/ListingDialog/ListingDialog';
import { listings as seedListings } from './data/listings';

const sortLabels = {
  id: 'ID',
  nombre: 'Nombre',
  estado: 'Estado',
  precio: 'Precio Base',
  sku: 'SKU',
};

function idsOf(node) {
  return [node.id, ...(node.children || []).flatMap(idsOf)];
}

function collectIds(nodes, targetId) {
  for (const node of nodes) {
    if (node.id === targetId) return idsOf(node);
    if (node.children) {
      const found = collectIds(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

function findLabel(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node.label;
    if (node.children) {
      const label = findLabel(node.children, id);
      if (label) return label;
    }
  }
  return '';
}

function formatPrice(value) {
  return `$ ${Number(value).toLocaleString('es-CL')}`;
}

function specifications(item) {
  if (item.tipo === 'servicio') {
    return [
      item.restriccionEdad ? 'Solo Mayores De Edad' : 'Sin Restricción De Edad',
      item.tiempo,
    ]
      .filter(Boolean)
      .join(', ');
  }
  return [
    item.tamano,
    item.peso,
    item.color,
    item.material,
    item.stock !== '' && item.stock != null ? `Stock ${item.stock}` : '',
    item.precioOferta ? `Oferta ${formatPrice(item.precioOferta)}` : '',
  ]
    .filter(Boolean)
    .join(', ');
}

const headerCellSx = { fontWeight: 700, color: 'primary.contrastText' };

export default function Management() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => seedListings.map((item) => ({ ...item })));
  const [tableQuery, setTableQuery] = useState('');
  const [catalogQuery, setCatalogQuery] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortKey, setSortKey] = useState('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [sortAnchor, setSortAnchor] = useState(null);
  const [draft, setDraft] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const visible = useMemo(() => {
    const allowed = categoryId ? new Set(collectIds(categoryTree, categoryId) || []) : null;
    const text = tableQuery.trim().toLowerCase();
    const filtered = items.filter((item) => {
      const category = findLabel(categoryTree, item.categoriaId);
      const inCategory = !allowed || allowed.has(item.categoriaId);
      const matches =
        !text ||
        item.nombre.toLowerCase().includes(text) ||
        item.sku.toLowerCase().includes(text) ||
        category.toLowerCase().includes(text);
      return inCategory && matches;
    });
    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'precio') return a.precioBase - b.precioBase;
      if (sortKey === 'id') return a.id - b.id;
      const left = sortKey === 'sku' ? a.sku : a[sortKey];
      const right = sortKey === 'sku' ? b.sku : b[sortKey];
      return String(left).localeCompare(String(right), 'es');
    });
    return sortAsc ? sorted : sorted.reverse();
  }, [items, tableQuery, categoryId, sortKey, sortAsc]);

  function searchCatalog() {
    const text = catalogQuery.trim();
    navigate(text ? `/catalogo?buscar=${encodeURIComponent(text)}` : '/catalogo');
  }

  function saveListing(payload) {
    setItems((current) => {
      if (payload.id) return current.map((item) => (item.id === payload.id ? payload : item));
      const id = current.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      return [...current, { ...payload, id }];
    });
    setFormOpen(false);
  }

  function confirmDelete() {
    setItems((current) => current.filter((item) => item.id !== pendingDelete.id));
    setDeleteOpen(false);
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <StoreHeader
        query={catalogQuery}
        onQueryChange={setCatalogQuery}
        onSearchSubmit={searchCatalog}
        onOpenCategories={() => setMenuOpen(true)}
      />
      <Typography variant="h4" align="center" sx={{ mt: 4, mb: 3 }}>
        Gestión De Productos Y Servicios
      </Typography>
      <TextField
        value={tableQuery}
        onChange={(event) => setTableQuery(event.target.value)}
        placeholder="Buscar"
        inputProps={{ 'aria-label': 'Filtrar tabla' }}
        sx={{ width: '100%', maxWidth: 480, mx: 'auto', mb: 2, '& .MuiOutlinedInput-root': { minHeight: 52 } }}
      />
      <Box
        sx={{
          alignSelf: 'center',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 999,
          mb: 3,
        }}
      >
        <IconButton
          aria-label={sortAsc ? 'Orden ascendente' : 'Orden descendente'}
          onClick={() => setSortAsc((value) => !value)}
          sx={{ color: 'inherit' }}
        >
          <SwapVert />
        </IconButton>
        <ButtonBase
          onClick={(event) => setSortAnchor(event.currentTarget)}
          sx={{ color: 'inherit', pr: 2, gap: 0.5, fontWeight: 600 }}
        >
          {`Ordenar Por: ${sortLabels[sortKey]}`}
          <ExpandMore />
        </ButtonBase>
        <Menu anchorEl={sortAnchor} open={Boolean(sortAnchor)} onClose={() => setSortAnchor(null)}>
          {Object.entries(sortLabels).map(([key, label]) => (
            <MenuItem
              key={key}
              selected={sortKey === key}
              onClick={() => {
                setSortKey(key);
                setSortAnchor(null);
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <TableContainer sx={{ px: { xs: 2, md: 4 }, pb: 2 }}>
        <Table sx={{ maxWidth: 1200, mx: 'auto', bgcolor: 'background.paper' }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              {['ID', 'Nombre', 'Estado', 'Precio Base', 'SKU', 'Especificaciones', 'Categoría', 'Tipo', 'Acciones'].map(
                (header) => (
                  <TableCell key={header} sx={headerCellSx}>
                    {header}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No Hay Resultados
                </TableCell>
              </TableRow>
            ) : (
              visible.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.estado}</TableCell>
                  <TableCell>{formatPrice(item.precioBase)}</TableCell>
                  <TableCell>{item.sku || '—'}</TableCell>
                  <TableCell>{specifications(item)}</TableCell>
                  <TableCell>{findLabel(categoryTree, item.categoriaId)}</TableCell>
                  <TableCell>{item.tipo === 'servicio' ? 'Servicio' : 'Producto'}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton
                      aria-label={`Editar ${item.nombre}`}
                      onClick={() => {
                        setDraft(item);
                        setFormOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      aria-label={`Eliminar ${item.nombre}`}
                      onClick={() => {
                        setPendingDelete(item);
                        setDeleteOpen(true);
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <IconButton
        aria-label="Agregar"
        onClick={() => {
          setDraft({ id: null });
          setFormOpen(true);
        }}
        sx={{
          alignSelf: 'flex-end',
          mr: { xs: 2, md: 6 },
          mb: 4,
          width: 56,
          height: 56,
          bgcolor: 'text.primary',
          color: 'background.paper',
          '&:hover': { bgcolor: 'text.primary' },
        }}
      >
        <Add />
      </IconButton>
      <CategoryMenu
        open={menuOpen}
        selectedId={categoryId}
        onClose={() => setMenuOpen(false)}
        onSelect={(id) => {
          setCategoryId(id);
          setMenuOpen(false);
        }}
      />
      <ListingDialog
        open={formOpen}
        listing={draft}
        onClose={() => setFormOpen(false)}
        onExited={() => setDraft(null)}
        onSave={saveListing}
      />
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        TransitionProps={{ onExited: () => setPendingDelete(null) }}
      >
        <DialogTitle>Eliminar Registro</DialogTitle>
        <DialogContent>
          <DialogContentText>{`¿Eliminar ${pendingDelete?.nombre}?`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} sx={{ minHeight: 48 }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={confirmDelete} sx={{ minHeight: 48 }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
