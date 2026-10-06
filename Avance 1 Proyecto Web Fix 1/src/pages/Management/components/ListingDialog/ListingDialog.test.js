import { createElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { afterEach, expect, test, vi } from 'vitest';
import theme from '../../../../theme/theme';
import ListingDialog from './ListingDialog';

afterEach(() => {
  vi.restoreAllMocks();
});

function renderDialog(onSave = vi.fn()) {
  render(
    createElement(
      ThemeProvider,
      { theme },
      createElement(ListingDialog, { open: true, listing: null, onClose: () => {}, onSave }),
    ),
  );
  return onSave;
}

test('imprime y guarda un producto con los datos exigidos', () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  const onSave = renderDialog();

  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Polera' } });
  fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'ropa' } });
  fireEvent.change(screen.getByLabelText('Precio Base'), { target: { value: '19990' } });
  fireEvent.change(screen.getByLabelText('SKU'), { target: { value: 'POL-1' } });
  fireEvent.change(screen.getByLabelText('Tamaño'), { target: { value: 'M' } });
  fireEvent.change(screen.getByLabelText('Peso'), { target: { value: '200 g' } });
  fireEvent.change(screen.getByLabelText('Color'), { target: { value: 'Roja' } });
  fireEvent.change(screen.getByLabelText('Material Principal'), { target: { value: 'Algodón' } });
  fireEvent.change(screen.getByLabelText('Stock'), { target: { value: '10' } });
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

  expect(log).toHaveBeenCalledWith(
    expect.objectContaining({
      nombre: 'Polera',
      categoriaId: 'ropa',
      precioBase: 19990,
      sku: 'POL-1',
      tamano: 'M',
      peso: '200 g',
      color: 'Roja',
      material: 'Algodón',
      stock: 10,
      tipo: 'producto',
    }),
  );
  expect(onSave).toHaveBeenCalled();
});

test('un servicio pide tiempo y puede restringir la edad', () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  const onSave = renderDialog();

  fireEvent.click(screen.getByLabelText('Servicio'));
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Consulta' } });
  fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'medico' } });
  fireEvent.change(screen.getByLabelText('Precio Base'), { target: { value: '30000' } });
  fireEvent.change(screen.getByLabelText('Tiempo'), { target: { value: '45 minutos' } });
  fireEvent.click(screen.getByLabelText('Solo Mayores De Edad'));
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

  expect(log).toHaveBeenCalledWith(
    expect.objectContaining({
      tipo: 'servicio',
      nombre: 'Consulta',
      categoriaId: 'medico',
      tiempo: '45 minutos',
      restriccionEdad: true,
      sku: '',
    }),
  );
  expect(onSave).toHaveBeenCalled();
});
