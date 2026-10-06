import { createElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { afterEach, expect, test, vi } from 'vitest';
import theme from '../../../../theme/theme';
import CompanyRegisterForm from './CompanyRegisterForm';

afterEach(() => {
  vi.restoreAllMocks();
});

function renderForm() {
  return render(createElement(ThemeProvider, { theme }, createElement(CompanyRegisterForm)));
}

test('imprime en consola los datos de la empresa y del emprendedor', () => {
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
  fireEvent.change(screen.getByPlaceholderText('Teléfono'), { target: { value: '912345678' } });
  fireEvent.change(screen.getByPlaceholderText('Nombre Del Emprendedor'), { target: { value: 'Ana' } });
  fireEvent.change(screen.getByPlaceholderText('RUN Del Emprendedor'), {
    target: { value: '12.345.678-9' },
  });
  fireEvent.change(screen.getByPlaceholderText('Teléfono Del Emprendedor'), {
    target: { value: '987654321' },
  });
  fireEvent.change(screen.getByPlaceholderText('Correo Del Emprendedor'), {
    target: { value: 'ana@enbu.cl' },
  });
  fireEvent.change(screen.getByPlaceholderText('Dirección Del Emprendedor'), {
    target: { value: 'Los Aromos 45' },
  });
  fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'secreta' } });
  fireEvent.change(screen.getByPlaceholderText('Confirmar Contraseña'), {
    target: { value: 'secreta' },
  });
  fireEvent.click(screen.getByLabelText('Productos'));
  fireEvent.click(screen.getByLabelText('Servicios'));
  fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

  expect(log).toHaveBeenCalledWith({
    nombreEmpresa: 'Enbu SpA',
    rutEmpresa: '76.123.456-7',
    correo: 'contacto@enbu.cl',
    sitioWeb: 'https://enbu.cl',
    direccion: 'Av. Principal 123',
    telefono: '912345678',
    password: 'secreta',
    confirmPassword: 'secreta',
    tipoNegocio: ['productos', 'servicios'],
    emprendedor: {
      nombre: 'Ana',
      run: '12.345.678-9',
      telefono: '987654321',
      correo: 'ana@enbu.cl',
      direccion: 'Los Aromos 45',
    },
  });
});
