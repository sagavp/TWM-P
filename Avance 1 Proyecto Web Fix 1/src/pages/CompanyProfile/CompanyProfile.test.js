import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import theme from '../../theme/theme';
import CompanyProfile from './CompanyProfile';

function renderPage() {
  return render(
    createElement(
      ThemeProvider,
      { theme },
      createElement(MemoryRouter, null, createElement(CompanyProfile)),
    ),
  );
}

test('muestra el título y el enlace para volver', () => {
  renderPage();

  expect(screen.getByRole('heading', { name: 'Perfil De Empresa' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Volver' }).getAttribute('href')).toBe('/catalogo');
});
