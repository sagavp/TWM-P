import { createElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import theme from '../../theme/theme';
import Management from './Management';

function renderPage() {
  return render(
    createElement(ThemeProvider, { theme }, createElement(MemoryRouter, null, createElement(Management))),
  );
}

test('lista, filtra, ordena, edita y elimina publicaciones', async () => {
  renderPage();

  expect(screen.getByRole('heading', { name: 'Gestión De Productos Y Servicios' })).toBeTruthy();
  expect(screen.getByText('Notebook 14 Pulgadas')).toBeTruthy();
  expect(screen.getByText('Servicio De Aseo')).toBeTruthy();

  fireEvent.change(screen.getByRole('textbox', { name: 'Buscar' }), { target: { value: 'aseo' } });
  expect(screen.getByText('Notebook 14 Pulgadas')).toBeTruthy();
  fireEvent.change(screen.getByRole('textbox', { name: 'Buscar' }), { target: { value: '' } });

  fireEvent.change(screen.getByRole('textbox', { name: 'Filtrar tabla' }), { target: { value: 'aseo' } });
  expect(screen.getByText('Servicio De Aseo')).toBeTruthy();
  expect(screen.queryByText('Notebook 14 Pulgadas')).toBeNull();

  fireEvent.change(screen.getByRole('textbox', { name: 'Filtrar tabla' }), { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: /Ordenar Por/ }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Nombre' }));
  const names = screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.textContent);
  expect(names[0]).toContain('Audífonos Inalámbricos');

  fireEvent.click(screen.getByRole('button', { name: 'Editar Notebook 14 Pulgadas' }));
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Notebook Gamer' } });
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
  expect(screen.getByText('Notebook Gamer')).toBeTruthy();
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

  fireEvent.click(screen.getByRole('button', { name: 'Eliminar Servicio De Aseo' }));
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(screen.getByText('Servicio De Aseo')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Eliminar Servicio De Aseo' }));
  fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(screen.queryByText('Servicio De Aseo')).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Abrir categorías' }));
  fireEvent.click(screen.getByRole('button', { name: 'Expandir Productos' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Expandir Tecnología' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Computación' }));
  expect(screen.getByText('Notebook Gamer')).toBeTruthy();
  expect(screen.queryByText('Clases De Matemática')).toBeNull();
});
