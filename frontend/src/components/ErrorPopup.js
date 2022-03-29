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

  if (typeof errorMsg === 'string') {
    if (errorMsg.startsWith("\"") && errorMsg.endsWith("\"")) {
      errorMsg = errorMsg.substring(1, errorMsg.length - 1);
    }
    if (errorMsg.startsWith("<p>") && errorMsg.endsWith("</p>")) {
      errorMsg = errorMsg.substring(3, errorMsg.length - 4);
    }
  }
  
  const errorStyle = {
    background: '#d32f2f',
    border: 0,
    borderRadius: 3,
    color: 'white',
    padding: '0 30px',
  }

  return (
    <Snackbar  sx={{ height: "100%" }} anchorOrigin={{vertical: "top", horizontal: "center"}} open={snackBarOpen}  onClose = {() =>setSnackBarOpen(false)} autoHideDuration={1500} >
      <Alert severity="warning" style={errorStyle}  sx={{ width: '100%' }} >
        {errorMsg }
      </Alert>
    </Snackbar>
  )
}

export default ErrorPopup;