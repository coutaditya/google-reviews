import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';

export default function Alert({msg, setState, state}) {

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  return (
    <div>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message={msg}
        key={state.Transition.name}
        autoHideDuration={1200}
      />
    </div>
  );
}