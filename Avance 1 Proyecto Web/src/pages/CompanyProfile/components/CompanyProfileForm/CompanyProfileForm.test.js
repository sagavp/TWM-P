import { createElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { afterEach, expect, test, vi } from 'vitest';
import theme from '../../../../theme/theme';
import CompanyProfileForm from './CompanyProfileForm';

afterEach(() => {
  vi.restoreAllMocks();
});

function renderForm() {
  return render(createElement(ThemeProvider, { theme }, createElement(CompanyProfileForm)));
}

test('guarda productos y servicios juntos', () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  renderForm();

  fireEvent.change(screen.getByPlaceholderText('Nombre Empresa'), { target: { value: 'Enbu SpA' } });
  fireEvent.change(screen.getByPlaceholderText('RUT Empresa'), { target: { value: '76.123.456-7' } });
  fireEvent.change(screen.getByPlaceholderText('Correo Empresa'), {
    target: { value: 'contacto@enbu.cl' },
  });
  fireEvent.change(screen.getByPlaceholderText('Sitio Web'), { target: { value: 'https://enbu.cl' } });
  fireEvent.change(screen.getByPlaceholderText('Dirección Local'), {
    target: { value: 'Av. Principal 123' },
  });
  fireEvent.change(screen.getByPlaceholderText('Teléfono 1'), { target: { value: '912345678' } });
  fireEvent.change(screen.getByPlaceholderText('Teléfono 2'), { target: { value: '987654321' } });
  fireEvent.click(screen.getByLabelText('Productos'));
  fireEvent.click(screen.getByLabelText('Servicios'));
  fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));

  expect(log).toHaveBeenCalledWith({
    nombreEmpresa: 'Enbu SpA',
    rutEmpresa: '76.123.456-7',
    correo: 'contacto@enbu.cl',
    sitioWeb: 'https://enbu.cl',
    direccion: 'Av. Principal 123',
    telefonos: ['912345678', '987654321'],
    tipoNegocio: ['productos', 'servicios'],
  });
});

test('no elimina el único teléfono de la empresa', () => {
  renderForm();

  fireEvent.click(screen.getByRole('button', { name: 'Eliminar teléfono 2' }));
  expect(screen.getByPlaceholderText('Teléfono 1')).toBeTruthy();
  expect(screen.queryByPlaceholderText('Teléfono 2')).toBeNull();
  expect(screen.queryByRole('button', { name: 'Eliminar teléfono 1' })).toBeNull();
});
