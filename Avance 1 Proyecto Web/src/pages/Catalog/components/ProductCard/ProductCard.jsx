import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export function formatPrice(value) {
  return `$ ${value.toLocaleString('es-CL')}`;
}

export default function ProductCard({ product }) {
  return (
    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 'none' }}>
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        sx={{ height: 180, objectFit: 'cover', bgcolor: 'divider' }}
      />
      <CardContent>
        <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{product.name}</Typography>
        <Typography>{formatPrice(product.price)}</Typography>
      </CardContent>
    </Card>
  );
}
