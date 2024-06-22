
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import { TOKEN_NAME } from '../constants/constants';
import { userAtom } from '../store/atoms/atoms';
import { useSetRecoilState } from 'recoil';

const theme = createTheme({
  palette: {
      mode: 'dark',
      primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
      darker: blue[900],
      },
  },
});

const UserButton = () => {
  const [open, setOpen] = useState(false);
  const setUser = useSetRecoilState(userAtom);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem(TOKEN_NAME)
    setUser({
      token: null,
      isEditor: false
    })
    setOpen(false)
  }

  const body = (
    <Box sx={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      boxShadow: 24, 
      p: 4, 
      borderRadius: '8px',
      bgcolor: '#fff',
      outline: 'none' 
    }}>
      <ThemeProvider theme={theme}>
      <Typography variant="h6" component="h2" gutterBottom>
        User Information
      </Typography>
      <Typography variant="body1" gutterBottom>
        Username: your_username
      </Typography>
      <Typography variant="body1" gutterBottom>
        Name: your_name
      </Typography>
      <Button variant="contained" color="primary" sx={{ backgroundColor: theme.palette.primary.darker }} onClick={handleSignOut}>Sign out</Button>
      </ThemeProvider>
    </Box>
  );

  return (
    <div>
      <Button onClick={handleOpen} color="inherit" sx={{ fontSize: '1.2rem', textTransform: 'none' }}>
        User
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
};

export default UserButton;