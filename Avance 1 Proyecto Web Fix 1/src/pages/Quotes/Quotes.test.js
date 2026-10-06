import { createElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import theme from '../../theme/theme';
import Quotes from './Quotes';

afterEach(() => {
  vi.restoreAllMocks();
});

function renderPage() {
  return render(createElement(ThemeProvider, { theme }, createElement(MemoryRouter, null, createElement(Quotes))));
}

test('arma una cotización, ajusta el precio vencido y permite editar o eliminar', async () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  renderPage();

  expect(screen.getByRole('heading', { name: 'Cotizaciones' })).toBeTruthy();
  expect(screen.getByText('Precio Ajustado')).toBeTruthy();
  expect(screen.getByText(/\$\s*50[.,]000/)).toBeTruthy();

  fireEvent.change(screen.getByLabelText('Descripción 1'), { target: { value: 'celular' } });
  fireEvent.change(screen.getByLabelText('Cantidad 1'), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Guardar Cotización' }));

  expect(log).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 3,
      estado: 'Solicitada',
      total: 559980,
      items: [expect.objectContaining({ productId: 'celular', cantidad: 2, descripcion: 'Celular 128 GB' })],
    }),
  );
  expect(
    screen.getAllByRole('row').some((row) => row.textContent.includes('Celular 128 GB')),
  ).toBe(true);

  fireEvent.click(screen.getByRole('button', { name: 'Agregar Producto' }));
  expect(screen.getByLabelText('Descripción 4').textContent).toContain('Notebook 14 Pulgadas');
  expect(screen.getByLabelText('Descripción 4').textContent).not.toContain('Servicio De Aseo');

  fireEvent.click(screen.getByRole('button', { name: 'Editar cotización 2' }));
  fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'Aceptada Por El Cliente' } });
  fireEvent.click(screen.getByRole('button', { name: 'Guardar Cotización' }));
  expect(
    screen.getAllByRole('row').some((row) => row.textContent.includes('Aceptada Por El Cliente') && row.textContent.includes('Servicio De Aseo')),
  ).toBe(true);

  fireEvent.click(screen.getByRole('button', { name: 'Eliminar cotización 2' }));
  expect(screen.getByText('¿Eliminar la cotización 2?')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  fireEvent.click(screen.getByRole('button', { name: 'Eliminar cotización 2' }));
  fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(screen.queryByRole('button', { name: 'Eliminar cotización 2' })).toBeNull();
});
