import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme/theme';
import AuthHeader from './AuthHeader';

test('muestra el logo de Enbu', () => {
  render(createElement(ThemeProvider, { theme }, createElement(AuthHeader)));

  expect(screen.getByRole('img', { name: 'Enbu' })).toBeTruthy();
});
