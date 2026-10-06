import { createElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import theme from '../../../../theme/theme';
import RegisterForm from './RegisterForm';

afterEach(() => {
  vi.restoreAllMocks();
});

function renderForm() {
  return render(
    createElement(
      ThemeProvider,
      { theme },
      createElement(MemoryRouter, null, createElement(RegisterForm)),
    ),
  );
}

test('imprime en consola los datos capturados al registrarse', () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  renderForm();

  fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Ana' } });
  fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'Pérez' } });
  fireEvent.change(screen.getByPlaceholderText('Rut'), { target: { value: '12.345.678-9' } });
  fireEvent.change(screen.getByPlaceholderText('Correo Electrónico'), {
    target: { value: 'ana@correo.cl' },
  });
  fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'secreta' } });
  fireEvent.change(screen.getByPlaceholderText('Confirmar Contraseña'), {
    target: { value: 'secreta' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

  expect(log).toHaveBeenCalledWith({
    nombre: 'Ana',
    apellido: 'Pérez',
    rut: '12.345.678-9',
    correo: 'ana@correo.cl',
    password: 'secreta',
    confirmPassword: 'secreta',
  });
});
