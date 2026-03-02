import { Card, CardContent, CardMedia, Typography, Button, CardActions, Box, IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const ProductCard = ({ product, onAdd, getIcon, userRole, onDelete }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: 3,
      transition: '0.3s',
      position: 'relative', // För att ikonen ska kunna placeras absolut
      '&:hover': { transform: 'scale(1.02)', boxShadow: 6 }
    }}>
      
      {/* RADERA-IKON ENDAST FÖR ADMIN */}
      {userRole === 'Admin' && (
        <IconButton 
          size="small" 
          color="error" 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            bgcolor: 'rgba(255,255,255,0.85)',
            '&:hover': { bgcolor: '#ffebee' }
          }}
          onClick={(e) => {
            e.stopPropagation(); // Hindra andra klick-event
            onDelete();
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      )}

      <Box sx={{ p: 2, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'center' }}>
        <CardMedia
          component="img"
          sx={{ height: 120, width: 'auto', objectFit: 'contain' }}
          image={product.imageUrl || 'https://via.placeholder.com/150?text=Vara'}
          alt={product.name}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <Box sx={{ color: 'text.secondary', display: 'flex' }}>
            {getIcon ? getIcon(product.categoryName) : <CategoryIcon sx={{ fontSize: 14 }} />}
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600, letterSpacing: 0.5 }}
          >
            {product.categoryName}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          fullWidth
          variant="outlined" 
          startIcon={<AddShoppingCartIcon />}
          onClick={() => onAdd(product)}
          sx={{ borderRadius: 2, fontWeight: 'bold' }}
        >
          Lägg till
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;