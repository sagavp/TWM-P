import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import theme from '../../theme/theme';
import CompanyRegister from './CompanyRegister';

function renderPage() {
  return render(
    createElement(
      ThemeProvider,
      { theme },
      createElement(MemoryRouter, null, createElement(CompanyRegister)),
    ),
  );
}

test('muestra el título y el enlace para volver al registro de persona', () => {
  renderPage();

  expect(screen.getByRole('heading', { name: 'Crear Cuenta Empresa' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Volver' }).getAttribute('href')).toBe('/registro');
});
