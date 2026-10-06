import { createElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { afterEach, expect, test, vi } from 'vitest';
import theme from '../../../../theme/theme';
import ProfileForm from './ProfileForm';

afterEach(() => {
  vi.restoreAllMocks();
});

function renderForm() {
  return render(createElement(ThemeProvider, { theme }, createElement(ProfileForm)));
}

test('imprime el perfil con teléfonos, direcciones y mayoría de edad', () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  renderForm();

  fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Ana' } });
  fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'Pérez' } });
  fireEvent.change(screen.getByPlaceholderText('Rut'), { target: { value: '12.345.678-9' } });
  fireEvent.change(screen.getByLabelText('Fecha De Nacimiento'), { target: { value: '1990-05-01' } });
  fireEvent.change(screen.getByPlaceholderText('Correo Electrónico'), {
    target: { value: 'ana@correo.cl' },
  });
  fireEvent.change(screen.getByPlaceholderText('Teléfono 1'), { target: { value: '912345678' } });
  fireEvent.change(screen.getByPlaceholderText('Teléfono 2'), { target: { value: '987654321' } });
  fireEvent.change(screen.getByPlaceholderText('Dirección 1'), { target: { value: 'Casa 123' } });
  fireEvent.change(screen.getByPlaceholderText('Dirección 2'), { target: { value: 'Oficina 45' } });
  fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));

  expect(log).toHaveBeenCalledWith({
    nombre: 'Ana',
    apellido: 'Pérez',
    rut: '12.345.678-9',
    fechaNacimiento: '1990-05-01',
    esMayorDeEdad: true,
    correo: 'ana@correo.cl',
    telefonos: ['912345678', '987654321'],
    direcciones: ['Casa 123', 'Oficina 45'],
  });
});

test('permite agregar otro teléfono y no elimina la única dirección', () => {
  renderForm();

  fireEvent.click(screen.getByRole('button', { name: 'Agregar teléfono' }));
  expect(screen.getByPlaceholderText('Teléfono 3')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'Eliminar dirección 2' }));
  expect(screen.getByPlaceholderText('Dirección 1')).toBeTruthy();
  expect(screen.queryByPlaceholderText('Dirección 2')).toBeNull();
  expect(screen.queryByRole('button', { name: 'Eliminar dirección 1' })).toBeNull();
});
