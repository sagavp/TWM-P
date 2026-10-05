import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForward from '@mui/icons-material/ArrowForward';
import StoreHeader from '../../components/organisms/StoreHeader/StoreHeader';
import CategoryMenu from './components/CategoryMenu/CategoryMenu';
import ProductCard from './components/ProductCard/ProductCard';
import { categoryTree } from './data/categories';
import { products } from './data/products';

const PAGE_SIZE = 8;

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
  return 'Todos Los Productos';
}

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('buscar') ?? '');
  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    const allowed = categoryId ? new Set(collectIds(categoryTree, categoryId) || []) : null;
    const text = query.trim().toLowerCase();
    return products.filter((product) => {
      const inCategory = !allowed || allowed.has(product.categoryId);
      const matches = !text || product.name.toLowerCase().includes(text);
      return inCategory && matches;
    });
  }, [query, categoryId]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const title = categoryId ? findLabel(categoryTree, categoryId) : 'Todos Los Productos';

  function changeQuery(value) {
    setQuery(value);
    setPage(1);
  }

  function changeCategory(id) {
    setCategoryId(id);
    setPage(1);
    setMenuOpen(false);
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <StoreHeader query={query} onQueryChange={changeQuery} onOpenCategories={() => setMenuOpen(true)} />
      <Typography variant="h4" align="center" sx={{ my: 4 }}>
        {title}
      </Typography>
      <Box sx={{ flex: 1, px: { xs: 2, md: 4 } }}>
        {visible.length === 0 ? (
          <Typography align="center">No Hay Resultados</Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
              gap: 2,
              maxWidth: 1200,
              mx: 'auto',
            }}
          >
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>
        )}
      </Box>
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ py: 4 }}>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
          <ButtonBase
            key={number}
            aria-label={`Página ${number}`}
            aria-current={number === currentPage ? 'page' : undefined}
            onClick={() => setPage(number)}
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: number === currentPage ? 'text.primary' : 'background.paper',
              color: number === currentPage ? 'background.paper' : 'text.primary',
              fontWeight: 600,
            }}
          >
            {number}
          </ButtonBase>
        ))}
        <ButtonBase
          aria-label="Siguiente"
          disabled={currentPage === pageCount}
          onClick={() => setPage(currentPage + 1)}
          sx={{
            height: 40,
            px: 1.5,
            borderRadius: 1,
            bgcolor: 'background.paper',
            gap: 0.5,
            fontWeight: 600,
            '&.Mui-disabled': { opacity: 0.5 },
          }}
        >
          Siguiente
          <ArrowForward sx={{ fontSize: 18 }} />
        </ButtonBase>
      </Stack>
      <CategoryMenu
        open={menuOpen}
        selectedId={categoryId}
        onClose={() => setMenuOpen(false)}
        onSelect={changeCategory}
      />
    </Box>
  );
}
