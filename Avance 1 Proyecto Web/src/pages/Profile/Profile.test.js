import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import theme from '../../theme/theme';
import Profile from './Profile';

function renderPage() {
  return render(
    createElement(
      ThemeProvider,
      { theme },
      createElement(MemoryRouter, null, createElement(Profile)),
    ),
  );
}

test('muestra el título y el enlace para volver', () => {
  renderPage();

  expect(screen.getByRole('heading', { name: 'Mi Perfil' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Volver' }).getAttribute('href')).toBe('/catalogo');
});
