import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, 
  Checkbox, FormControlLabel, Box, Divider, IconButton, Tooltip,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

const SavedLists = ({ onUpdate, currentUser, title }) => {
  const [lists, setLists] = useState([]);
  const [open, setOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  // Enkel logik för att översätta texter inuti komponenten baserat på rubriken
  const isEnglish = title === "Saved Lists";
  const labels = {
    noLists: isEnglish ? "No saved lists found." : "Inga sparade listor hittades.",
    deleteTitle: isEnglish ? "Delete shopping list?" : "Radera inköpslista?",
    deleteText: isEnglish ? "Are you sure you want to delete the list for " : "Är du säker på att du vill ta bort listan för ",
    cancel: isEnglish ? "Cancel" : "Avbryt",
    confirm: isEnglish ? "Yes, delete" : "Ja, ta bort",
    loading: isEnglish ? "Loading name..." : "Laddar namn...",
    emptyList: isEnglish ? "No items saved in this list." : "Inga varor sparade i denna lista.",
    dateMissing: isEnglish ? "Date missing" : "Datum saknas"
  };

  const fetchLists = () => {
    axios.get('/api/ShoppingLists') 
      .then(response => setLists(response.data))
      .catch(error => console.error("Fel vid hämtning:", error));
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleClickOpen = (list) => {
    setListToDelete(list);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setListToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (listToDelete) {
      try {
        await axios.delete(`s/api/ShoppingLists/${listToDelete.id}`);
        setLists(lists.filter(l => l.id !== listToDelete.id));
        if (onUpdate) onUpdate();
        handleClose();
      } catch (error) {
        console.error("Fel vid radering:", error);
      }
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* HÄR ANVÄNDS DEN NYA TITLE-PROPEN FRÅN APP.JSX */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, color: '#1a2f23' }}>
        {title}
      </Typography>
      
      {lists.length === 0 ? (
        <Typography color="text.secondary">{labels.noLists}</Typography>
      ) : (
        lists.map(list => {
          const items = list.listProducts || []; 
          
          return (
            <Accordion key={list.id} sx={{ mb: 2, borderRadius: '12px !important', overflow: 'hidden', border: '1px solid #eee' }} elevation={0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
                  <Typography variant="h6"><strong>{list.residentName}</strong></Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {list.createdAt ? new Date(list.createdAt).toLocaleDateString() : labels.dateMissing}
                    </Typography>
                    
                    {currentUser?.role === 'Admin' && (
                      <IconButton onClick={(e) => { e.stopPropagation(); handleClickOpen(list); }} color="error" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: '#fcfcfc' }}>
                <Divider sx={{ mb: 1 }} />
                {items.length === 0 ? (
                  <Typography variant="body2" sx={{ p: 2, fontStyle: 'italic' }}>{labels.emptyList}</Typography>
                ) : (
                  <List>
                    {items.map((item, index) => (
                      <ListItem key={index} divider sx={{ py: 1 }}>
                        <FormControlLabel
                          control={<Checkbox color="success" size="small" />}
                          label={
                            <Typography variant="body1">
                              <strong style={{ color: '#2e7d32' }}>{item.quantity}x</strong> {item.product?.name || labels.loading}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })
      )}

      {/* DIALOG FÖR RADERING (OCKSÅ ÖVERSATT) */}
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>{labels.deleteTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {labels.deleteText} <strong>{listToDelete?.residentName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2 }}>{labels.cancel}</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ borderRadius: 2 }}>{labels.confirm}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavedLists;