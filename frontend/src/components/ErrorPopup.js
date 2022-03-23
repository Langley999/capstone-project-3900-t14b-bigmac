import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';

// Shows an error message in a popup at the top of the screen
const ErrorPopup = ({ errorMsg, snackBarOpen, setSnackBarOpen }) => {

  // do nothing if message is empty
  if (errorMsg === '' || typeof errorMsg === 'undefined') {
    return null;
  }

  const errorStyle = {
    background: '#d32f2f',
    border: 0,
    borderRadius: 3,
    color: 'white',
    padding: '0 30px',
  }

  return (
    <Snackbar  sx={{ height: "100%" }} anchorOrigin={{vertical: "top", horizontal: "center"}} open={snackBarOpen}  onClose = {() =>setSnackBarOpen(false)} autoHideDuration={2000} >
      <Alert severity="warning" style={errorStyle}  sx={{ width: '100%' }} >
        {errorMsg }
      </Alert>
    </Snackbar>
  )
}

export default ErrorPopup;