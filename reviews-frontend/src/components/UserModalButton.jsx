
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const UserButton = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignOut = () => {
    console.log("signing out");
  }

  const body = (
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '8px' }}>
      <Typography variant="h6" component="h2" gutterBottom>
        User Information
      </Typography>
      <Typography variant="body1" gutterBottom>
        Username: your_username
      </Typography>
      <Typography variant="body1" gutterBottom>
        Name: your_name
      </Typography>
      {/* Add your signout button here */}
      <Button variant="contained" color="primary" onClick={handleSignOut}>Sign out</Button>
    </Box>
  );

  return (
    <div>
      <Button onClick={handleOpen} style={{ borderRadius: '50%', width: '50px', height: '50px', backgroundColor: '#007bff', color: '#fff', position: 'fixed', top: '500px', right: '20px' }}>
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