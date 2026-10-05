import { createElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { expect, test, vi } from 'vitest';
import theme from '../../../../theme/theme';
import CategoryMenu from './CategoryMenu';

test('permite elegir una categoría del árbol', async () => {
  const onSelect = vi.fn();
  render(
    createElement(
      ThemeProvider,
      { theme },
      createElement(CategoryMenu, {
        open: true,
        selectedId: null,
        onClose: () => {},
        onSelect,
      }),
    ),
  );

  fireEvent.click(screen.getByRole('button', { name: 'Expandir Servicios' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Expandir Servicios Domésticos' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Aseo' }));
  expect(onSelect).toHaveBeenCalledWith('aseo');
});
