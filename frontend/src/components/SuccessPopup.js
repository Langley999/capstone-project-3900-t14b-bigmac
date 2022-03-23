import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';

// Shows an error message in a popup at the top of the screen
const SuccessPopup = ({ successMsg, snackBarOpen, setSnackBarOpen }) => {

  // do nothing if message is empty
  if (successMsg === '' || typeof successMsg === 'undefined') {
    return null;
  }

  const successStyle = {
    backgroundColor: '#edf7ec',
    border: 0,
    borderRadius: 3,
    color: 'white',
    padding: '0 30px'
  }

  return (
    <Snackbar  sx={{ height: "100%" }} anchorOrigin={{vertical: "top", horizontal: "center"}} open={snackBarOpen}  onClose = {() =>setSnackBarOpen(false)} autoHideDuration={2000} >
      <Alert severity="success" style={{successStyle, backgroundColor: '#edf7ec'}} sx={{ width: '100%' }} >
        {successMsg}
      </Alert>
    </Snackbar>
  )
}

export default SuccessPopup;