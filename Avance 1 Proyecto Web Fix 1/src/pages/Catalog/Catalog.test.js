import { createElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import theme from '../../theme/theme';
import Catalog from './Catalog';

function renderCatalog() {
  return render(
    createElement(
      ThemeProvider,
      { theme },
      createElement(MemoryRouter, null, createElement(Catalog)),
    ),
  );
}

test('abre el catálogo filtrado cuando la búsqueda llega desde otra sección', () => {
  render(
    createElement(
      ThemeProvider,
      { theme },
      createElement(MemoryRouter, { initialEntries: ['/catalogo?buscar=café'] }, createElement(Catalog)),
    ),
  );

  expect(screen.getByText('Café En Grano 1 Kg')).toBeTruthy();
  expect(screen.queryByText('Notebook 14 Pulgadas')).toBeNull();
});

test('pagina el catálogo y filtra por búsqueda y categoría', () => {
  renderCatalog();

  expect(screen.getByRole('heading', { name: 'Todos Los Productos' })).toBeTruthy();
  expect(screen.getByText('Notebook 14 Pulgadas')).toBeTruthy();
  expect(screen.queryByText('Zapatillas Urbanas')).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
  expect(screen.getByText('Zapatillas Urbanas')).toBeTruthy();
  expect(screen.queryByText('Notebook 14 Pulgadas')).toBeNull();

  fireEvent.change(screen.getByRole('textbox', { name: 'Buscar' }), {
    target: { value: 'café' },
  });
  expect(screen.getByText('Café En Grano 1 Kg')).toBeTruthy();
  expect(screen.queryByText('Zapatillas Urbanas')).toBeNull();

  fireEvent.change(screen.getByRole('textbox', { name: 'Buscar' }), { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: 'Abrir categorías' }));
  fireEvent.click(screen.getByRole('button', { name: 'Servicios' }));

  expect(screen.getByRole('heading', { name: 'Servicios' })).toBeTruthy();
  expect(screen.getByText('Servicio De Aseo')).toBeTruthy();
  expect(screen.queryByText('Notebook 14 Pulgadas')).toBeNull();
});
