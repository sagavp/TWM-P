import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register/Register';
import CompanyRegister from './pages/CompanyRegister/CompanyRegister';
import Profile from './pages/Profile/Profile';
import CompanyProfile from './pages/CompanyProfile/CompanyProfile';
import Catalog from './pages/Catalog/Catalog';
import Management from './pages/Management/Management';
import Quotes from './pages/Quotes/Quotes';
import theme from './theme/theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/registro-empresa" element={<CompanyRegister />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/perfil-empresa" element={<CompanyProfile />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/gestion" element={<Management />} />
          <Route path="/cotizaciones" element={<Quotes />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
