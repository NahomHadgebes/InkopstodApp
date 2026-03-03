import { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use((config) => {
  const user = localStorage.getItem('inkopstod_user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
import { 
  Container, Grid, Typography, Box, Chip, Paper, Button, Divider, 
  Badge, Snackbar, Alert, IconButton, Tooltip, Drawer, List, 
  ListItem, ListItemIcon, ListItemText, ListItemButton, Avatar, TextField,
  createTheme, ThemeProvider, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  InputAdornment
} from '@mui/material';

// --- Ikoner ---
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic'; 
import MicNoneIcon from '@mui/icons-material/MicNone';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';

// --- Komponenter ---
import ProductCard from './components/ProductCard';
import SavedLists from './components/SavedLists';
import Login from './components/Login';

const drawerWidth = 260;

// --- ÖVERSÄTTNINGAR ---
const translations = {
  sv: {
    dashboard: "Dashboard",
    katalog: "Varukatalog",
    currentList: "Aktuell Lista",
    savedLists: "Sparade Listor",
    admin: "Administration",
    logout: "Logga ut",
    systemAdmin: "Systemansvarig",
    search: "Sök bland varor...",
    saveList: "SPARA INKÖPSLISTA",
    residentName: "Brukarens namn",
    finalize: "Slutför Inköpslista",
    emptyList: "Listan är tom. Gå till katalogen.",
    backToCatalog: "Till Katalogen",
    items: "Artiklar",
    status: "Status",
    active: "AKTIV & ONLINE",
    added: "tillagd",
    personal: "Personalhantering",
    sortiment: "Sortiment",
    name: "Namn",
    password: "Lösenord",
    add: "Lägg till",
    save: "Spara",
    exportPdf: "Exportera PDF",
    addVara: "Lägg till ny vara",
    cancel: "Avbryt",
    searchUser: "Sök personal...",
    confirmDelete: "Vill du verkligen ta bort denna användare?",
    deleteTitle: "Radera användare",
    deleteAction: "Ja, radera",
    latestList: "Senaste listan",
    totalLists: "Totalt sparade listor",
    confirmDeleteProduct: "Vill du verkligen radera denna vara från sortimentet?",
    deleteProductTitle: "Radera vara",
    listening: "Lyssnar...",
    micError: "Mikrofonen stöds inte i din webbläsare."
  },
  en: {
    dashboard: "Dashboard",
    katalog: "Product Catalog",
    currentList: "Current List",
    savedLists: "Saved Shopping Lists",
    admin: "Administration",
    logout: "Logout",
    systemAdmin: "System Admin",
    search: "Search products...",
    saveList: "SAVE SHOPPING LIST",
    residentName: "Resident Name",
    finalize: "Finalize Shopping List",
    emptyList: "The list is empty. Go to catalog.",
    backToCatalog: "To Catalog",
    items: "Items",
    status: "Status",
    active: "ACTIVE & ONLINE",
    added: "added",
    personal: "User Management",
    sortiment: "Inventory",
    name: "Name",
    password: "Password",
    add: "Add User",
    save: "Save Product",
    exportPdf: "Export PDF",
    addVara: "Add new item",
    cancel: "Cancel",
    searchUser: "Search staff...",
    confirmDelete: "Are you sure you want to delete this user?",
    deleteTitle: "Delete User",
    deleteAction: "Yes, delete",
    latestList: "Latest List",
    totalLists: "Total Saved Lists",
    confirmDeleteProduct: "Are you sure you want to remove this item?",
    deleteProductTitle: "Delete Item",
    listening: "Listening...",
    micError: "Speech recognition not supported."
  }
};

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32', dark: '#1b5e20', light: '#4caf50' },
    secondary: { main: '#1a2f23' },
    success: { main: '#2e7d32' }
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 } } },
    MuiPaper: { styleOverrides: { root: { boxShadow: '0px 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' } } }
  }
});

const Logo = ({ size = 40, color = '#4caf50', textColor = 'white' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Avatar sx={{ bgcolor: color, width: size, height: size, boxShadow: '0px 4px 10px rgba(0,0,0,0.15)', border: '2px solid rgba(255,255,255,0.2)' }}>
      <AddShoppingCartIcon sx={{ fontSize: size * 0.6 }} />
    </Avatar>
    <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -0.8, color: textColor, textTransform: 'uppercase' }}>
      Inköpsstöd
    </Typography>
  </Box>
);

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('inkopstod_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [lang, setLang] = useState('sv');
  const t = translations[lang];

  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState(""); 
  const [cart, setCart] = useState([]);
  const [residentName, setResidentName] = useState("");
  const [currentView, setCurrentView] = useState("dashboard"); 
  const [savedListsCount, setSavedListsCount] = useState(0);
  const [lastResident, setLastResident] = useState("-");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [allUsers, setAllUsers] = useState([]);
  const [newUserData, setNewUserData] = useState({ username: '', password: '', role: 'Personal' });
  
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', categoryName: 'Mejeri', imageUrl: '' });

  // Dialog states för radering
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openProductDeleteDialog, setOpenProductDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // LOGIK FÖR RÖST-TILL-TEXT MED PUNKT-RENSNING
  const startVoiceInput = (targetField) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSnackbar({ open: true, message: t.micError, severity: 'error' });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'sv' ? 'sv-SE' : 'en-US';
    recognition.start();
    setSnackbar({ open: true, message: t.listening, severity: 'info' });

    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript;
      
      // Rensar bort punkt i slutet om webbläsaren lägger till en
      if (transcript.endsWith('.')) {
        transcript = transcript.slice(0, -1);
      }

      if (targetField === 'search') setSearchTerm(transcript);
      if (targetField === 'newProduct') setNewProduct({ ...newProduct, name: transcript });
    };
  };

  const fetchData = async () => {
    try {
      const prodRes = await axios.get('/api/Products');
      setProducts(prodRes.data);
      const listRes = await axios.get('/api/ShoppingLists');
      setSavedListsCount(listRes.data.length);
      if (listRes.data.length > 0) {
        setLastResident(listRes.data[listRes.data.length - 1].residentName);
      }
    } catch (error) { console.error("Datafel:", error); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/Categories');
      setDbCategories(res.data);
    } catch (error) { console.error("Kategorifel:", error); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/Auth/users');
      setAllUsers(res.data);
    } catch (error) { console.error("Personalfel:", error); }
  };

  useEffect(() => {
    if (user) {
      fetchData();
      fetchCategories();
      if (user.role === 'Admin' && currentView === "settings") fetchUsers();
    }
  }, [user, currentView]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('inkopstod_user');
    setCurrentView("dashboard");
    setCart([]);
  };

  const updateQuantity = (productId, delta) => {
    setCart(curr => 
      curr.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart(curr => curr.filter(item => item.id !== productId));
  };

  const exportCurrentToPdf = () => {
    window.print();
  };

  const handleRegister = async () => {
    try {
      await axios.post('/api/Auth/register', newUserData);  
      setNewUserData({ username: '', password: '', role: 'Personal' });
      fetchUsers();
      setSnackbar({ open: true, message: 'Personal har lagts till!', severity: 'success' });
    } catch (err) { setSnackbar({ open: true, message: 'Kunde inte lägga till personal.', severity: 'error' }); }
  };

  const handleDeleteClick = (userObj) => {
    setUserToDelete(userObj);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(`/api/Auth/users/${userToDelete.id}`);
      setAllUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setOpenDeleteDialog(false);
      setUserToDelete(null);
      setSnackbar({ open: true, message: 'Användare raderad', severity: 'success' });
    } catch (err) { 
      setSnackbar({ open: true, message: err.response?.data?.message || 'Kunde inte radera användare.', severity: 'error' }); 
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteProductClick = (product) => {
    setProductToDelete(product);
    setOpenProductDeleteDialog(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await axios.delete(`/api/Products/${productToDelete.id}`);
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setOpenProductDeleteDialog(false);
      setProductToDelete(null);
      setSnackbar({ open: true, message: 'Vara raderad ur sortimentet', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Kunde inte radera varan.', severity: 'error' });
      setOpenProductDeleteDialog(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.imageUrl) return;
    const selectedCat = dbCategories.find(c => c.name === newProduct.categoryName);
    const payload = { name: newProduct.name, imageUrl: newProduct.imageUrl, categoryId: selectedCat ? selectedCat.id : 1 };
    try {
      await axios.post('/api/Products', payload);
      setNewProduct({ ...newProduct, name: '', imageUrl: '' });
      setOpenAddDialog(false);
      fetchData();
      setSnackbar({ open: true, message: 'Varan sparades framgångsrikt!', severity: 'success' });
    } catch (err) { setSnackbar({ open: true, message: 'Kunde inte spara varan.', severity: 'error' }); }
  };

  const handleSaveList = async () => {
    if (cart.length === 0 || !residentName.trim()) {
      setSnackbar({ open: true, message: t.residentName, severity: 'warning' });
      return;
    }
    try {
      const res = await axios.post(`/api/ShoppingLists?residentName=${encodeURIComponent(residentName)}`);
      for (const item of cart) {
        await axios.post(`/api/ShoppingLists/${res.data.id}/products`, {
          productId: item.id, quantity: item.quantity
        });
      }
      setSnackbar({ open: true, message: 'Inköpslistan sparad!', severity: 'success' });
      setCart([]); setResidentName(""); fetchData();
      setCurrentView("sparade");
    } catch (error) { setSnackbar({ open: true, message: 'Fel vid sparning.', severity: 'error' }); }
  };

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8faf9' }}>
          <Login onLogin={(data) => { setUser(data); localStorage.setItem('inkopstod_user', JSON.stringify(data)); }}>
            <Logo textColor="#1a2f23" size={50} />
          </Login>
        </Box>
      </ThemeProvider>
    );
  }

  const menuItems = [
    { text: t.dashboard, icon: <DashboardIcon />, view: 'dashboard' },
    { text: t.katalog, icon: <InventoryIcon />, view: 'katalog' },
    { text: t.currentList, icon: <Badge badgeContent={cart.length} color="error"><ShoppingBasketIcon /></Badge>, view: 'current-list' },
    { text: t.savedLists, icon: <ReceiptLongIcon />, view: 'sparade', count: savedListsCount },
  ];

  if (user.role === 'Admin') menuItems.push({ text: t.admin, icon: <SettingsIcon />, view: 'settings' });

  return (
    <ThemeProvider theme={theme}>
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            main { padding: 0 !important; margin: 0 !important; }
          }
        `}
      </style>
      <Box sx={{ display: 'flex', bgcolor: '#f8faf9', minHeight: '100vh' }}>
        <Drawer variant="permanent" sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#1a2f23', color: 'white', borderRight: 'none', boxShadow: '4px 0px 10px rgba(0,0,0,0.05)' }, '@media print': { display: 'none' } }}>
          <Box sx={{ p: 3, mb: 2 }}><Logo textColor="white" /></Box>
          <List sx={{ px: 2 }}>
            {menuItems.map((item) => (
              <ListItem key={item.view} disablePadding sx={{ mb: 1 }}>
                <ListItemButton onClick={() => setCurrentView(item.view)} selected={currentView === item.view} sx={{ borderRadius: 2, '&.Mui-selected': { bgcolor: 'primary.main' } }}>
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: currentView === item.view ? 700 : 500 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 'auto', px: 3, pb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.05)', p: 1, borderRadius: 2 }}>
              <Button size="small" variant={lang === 'sv' ? "contained" : "text"} onClick={() => setLang('sv')} sx={{ minWidth: 40, color: 'white' }}>SV</Button>
              <Button size="small" variant={lang === 'en' ? "contained" : "text"} onClick={() => setLang('en')} sx={{ minWidth: 40, color: 'white' }}>EN</Button>
            </Box>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: '#ff8a80' }}>
              <ListItemIcon sx={{ color: '#ff8a80', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary={t.logout} />
            </ListItemButton>
          </Box>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '@media print': { display: 'none' } }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#1a2f23', letterSpacing: -0.5 }}>{menuItems.find(i => i.view === currentView)?.text}</Typography>
              <Typography variant="subtitle1" color="text.secondary">{t.systemAdmin}: {user.username}</Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 800, width: 45, height: 45 }}>{user.username[0].toUpperCase()}</Avatar>
          </Box>

          {currentView === 'dashboard' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}><Paper sx={{ p: 4, borderRadius: 4, textAlign: 'left' }}><Typography color="text.secondary" variant="button">{t.totalLists}</Typography><Typography variant="h2" sx={{ fontWeight: 900, color: 'primary.main' }}>{savedListsCount}</Typography></Paper></Grid>
              <Grid item xs={12} md={4}><Paper sx={{ p: 4, borderRadius: 4, textAlign: 'left' }}><Typography color="text.secondary" variant="button">{t.latestList}</Typography><Typography variant="h4" sx={{ fontWeight: 900 }}>{lastResident}</Typography></Paper></Grid>
              <Grid item xs={12} md={4}><Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'primary.main', color: 'white' }}><Typography variant="button">{t.status}</Typography><Typography variant="h4" sx={{ fontWeight: 900 }}>{t.active}</Typography></Paper></Grid>
            </Grid>
          )}

          {currentView === 'katalog' && (
            <Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Paper sx={{ p: 1, pl: 3, flexGrow: 1, borderRadius: 3, display: 'flex', alignItems: 'center' }}>
                  <SearchIcon sx={{ color: 'text.secondary', mr: 2 }} />
                  <TextField 
                    fullWidth variant="standard" placeholder={t.search} 
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ py: 1.5 }} 
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => startVoiceInput('search')} color="primary">
                            <MicIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Paper>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)} sx={{ px: 3, whiteSpace: 'nowrap' }}>{t.addVara}</Button>
              </Box>
              <Grid container spacing={3}>
                {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                  <Grid item key={p.id} xs={12} sm={6} md={4} lg={3}>
                    <ProductCard 
                      product={p} 
                      userRole={user.role} 
                      onDelete={() => handleDeleteProductClick(p)} 
                      onAdd={(prod) => {
                        setCart(curr => {
                          const exists = curr.find(i => i.id === prod.id);
                          if (exists) return curr.map(i => i.id === prod.id ? {...i, quantity: i.quantity + 1} : i);
                          return [...curr, {...prod, quantity: 1}];
                        });
                        setSnackbar({ open: true, message: `${prod.name} ${t.added}`, severity: 'success' });
                      }} 
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {currentView === 'current-list' && (
            <Paper sx={{ p: 4, borderRadius: 5, maxWidth: 800, mx: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>{t.finalize}</Typography>
                <Button startIcon={<PictureAsPdfIcon />} onClick={exportCurrentToPdf}>{t.exportPdf}</Button>
              </Box>
              <TextField fullWidth label={t.residentName} variant="filled" value={residentName} onChange={(e) => setResidentName(e.target.value)} sx={{ mb: 3 }} />
              <Divider sx={{ mb: 3 }} />
              {cart.length > 0 ? (
                <>
                  <Box sx={{ mb: 4 }}>
                    {cart.map(i => (
                      <Box key={i.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                        <Typography sx={{ fontWeight: 600 }}>{i.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton onClick={() => updateQuantity(i.id, -1)} color="primary"><RemoveCircleOutlineIcon /></IconButton>
                          <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 700 }}>{i.quantity}</Typography>
                          <IconButton onClick={() => updateQuantity(i.id, 1)} color="primary"><AddCircleOutlineIcon /></IconButton>
                          {user.role === 'Admin' && (
                            <IconButton onClick={() => removeFromCart(i.id)} color="error"><DeleteOutlineIcon /></IconButton>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Button fullWidth variant="contained" size="large" disabled={!residentName} onClick={handleSaveList} sx={{ py: 1.8 }}>{t.saveList}</Button>
                </>
              ) : <Typography color="text.secondary" align="center">{t.emptyList}</Typography>}
            </Paper>
          )}

          {currentView === 'settings' && (
            <Box maxWidth="600px">
              <Paper sx={{ p: 4, borderRadius: 5 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 800 }}>{t.personal}</Typography>
                <TextField 
                  fullWidth size="small" placeholder={t.searchUser} 
                  sx={{ mb: 2 }} value={userSearchTerm} 
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  InputProps={{ startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }}
                />
                <List sx={{ mb: 3, maxHeight: '300px', overflowY: 'auto' }}>
                   {allUsers.filter(u => u.username.toLowerCase().includes(userSearchTerm.toLowerCase())).map(u => (
                     <ListItem key={u.id} divider sx={{ py: 1 }}>
                       <ListItemText primary={u.username} secondary={u.role} />
                       <IconButton edge="end" color="error" onClick={() => handleDeleteClick(u)}>
                         <DeleteOutlineIcon />
                       </IconButton>
                     </ListItem>
                   ))}
                </List>
                <Divider sx={{ mb: 3 }} />
                <TextField fullWidth label={t.name} size="small" sx={{ mb: 2 }} value={newUserData.username} onChange={e => setNewUserData({...newUserData, username: e.target.value})} />
                <TextField fullWidth label={t.password} size="small" type="password" sx={{ mb: 3 }} value={newUserData.password} onChange={e => setNewUserData({...newUserData, password: e.target.value})} />
                <Button variant="contained" fullWidth onClick={handleRegister}>{t.add}</Button>
              </Paper>
            </Box>
          )}

          {currentView === 'sparade' && <SavedLists onUpdate={fetchData} currentUser={user} title={t.savedLists} />}
        </Box>

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
          <DialogTitle sx={{ fontWeight: 800 }}>{t.addVara}</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField 
                fullWidth label={t.name} size="small" sx={{ mb: 2 }} 
                value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => startVoiceInput('newProduct')} size="small">
                        <MicIcon fontSize="small" color="primary" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField select fullWidth label="Kategori" size="small" SelectProps={{ native: true }} sx={{ mb: 2 }} value={newProduct.categoryName} onChange={e => setNewProduct({...newProduct, categoryName: e.target.value})}>
                {dbCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </TextField>
              <TextField fullWidth label="Bild-URL" size="small" sx={{ mb: 2 }} value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={() => setOpenAddDialog(false)} variant="outlined">{t.cancel}</Button>
            <Button onClick={handleAddProduct} variant="contained" color="success">{t.save}</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
          <DialogTitle sx={{ fontWeight: 800 }}>{t.deleteTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t.confirmDelete} <strong>{userToDelete?.username}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined">{t.cancel}</Button>
            <Button onClick={confirmDeleteUser} variant="contained" color="error">{t.deleteAction}</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openProductDeleteDialog} onClose={() => setOpenProductDeleteDialog(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
          <DialogTitle sx={{ fontWeight: 800 }}>{t.deleteProductTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t.confirmDeleteProduct} <strong>{productToDelete?.name}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={() => setOpenProductDeleteDialog(false)} variant="outlined">{t.cancel}</Button>
            <Button onClick={confirmDeleteProduct} variant="contained" color="error">{t.deleteAction}</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 3, px: 3 }}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;