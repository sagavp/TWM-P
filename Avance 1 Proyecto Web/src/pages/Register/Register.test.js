import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import theme from '../../theme/theme';
import Register from './Register';

function renderRegister() {
  return render(
    createElement(
      ThemeProvider,
      { theme },
      createElement(MemoryRouter, null, createElement(Register)),
    ),
  );
}

test('muestra el título y el enlace para volver al login', () => {
  renderRegister();

  expect(screen.getByRole('heading', { name: 'Crear Cuenta' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Volver' }).getAttribute('href')).toBe('/');
});
