import { createElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import theme from '../../../theme/theme';
import StoreHeader from './StoreHeader';

function renderHeader() {
  const onOpenCategories = vi.fn();
  const onQueryChange = vi.fn();
  render(
    createElement(
      ThemeProvider,
      { theme },
      createElement(
        MemoryRouter,
        null,
        createElement(StoreHeader, {
          query: '',
          onQueryChange,
          onOpenCategories,
        }),
      ),
    ),
  );
  return { onOpenCategories, onQueryChange };
}

test('muestra la búsqueda, las categorías y el menú de cuenta', () => {
  const { onOpenCategories } = renderHeader();

  fireEvent.click(screen.getByRole('button', { name: 'Abrir categorías' }));
  expect(onOpenCategories).toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: 'Mi Cuenta' }));
  expect(screen.getByRole('menuitem', { name: 'Gestión' }).getAttribute('href')).toBe('/gestion');
  expect(screen.getByRole('menuitem', { name: 'Cotizaciones' }).getAttribute('href')).toBe(
    '/cotizaciones',
  );
  expect(screen.getByRole('menuitem', { name: 'Mi Perfil' }).getAttribute('href')).toBe('/perfil');
  expect(screen.getByRole('menuitem', { name: 'Perfil De Empresa' }).getAttribute('href')).toBe(
    '/perfil-empresa',
  );
  expect(screen.getByRole('menuitem', { name: 'Cerrar Sesión' }).getAttribute('href')).toBe('/');
});
