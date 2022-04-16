import React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

/**
 * @returns an error message in a snackbar popup at the bottom of the screen
 */
const ErrorPopup = ({ errorMsg, snackBarOpen, setSnackBarOpen }) => {

  // do nothing if message is empty
  if (errorMsg === '' || typeof errorMsg === 'undefined') {
    return null;
  }

  // remove p tags or quotes from the beginning and end of error message if it exists
  if (typeof errorMsg === 'string') {
    if (errorMsg.startsWith('\"') && errorMsg.endsWith('\"')) {
      errorMsg = errorMsg.substring(1, errorMsg.length - 1);
    }
    if (errorMsg.startsWith('<p>') && errorMsg.endsWith('</p>')) {
      errorMsg = errorMsg.substring(3, errorMsg.length - 4);
    }
  }

  const handleClose = (event, reason) => {
    setSnackBarOpen(false);
  };
  
  const errorStyle = {
    background: '#d32f2f',
    border: 0,
    borderRadius: 3,
    color: 'white',
    padding: '0 30px',
  }

  return (
    <Snackbar  sx={{}} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={snackBarOpen}  onClose={handleClose} autoHideDuration={1500} >
      <Alert severity='warning' style={errorStyle}  sx={{ width: '100%' }} >
        {errorMsg }
      </Alert>
    </Snackbar>
  )
}

export default ErrorPopup;