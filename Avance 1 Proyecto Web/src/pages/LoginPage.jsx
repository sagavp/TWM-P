import Stack from '@mui/material/Stack';
import BrandPanel from '../components/login/BrandPanel';
import LoginForm from '../components/login/LoginForm';

export default function LoginPage() {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} sx={{ minHeight: '100vh' }}>
      <BrandPanel />
      <LoginForm />
    </Stack>
  );
}
