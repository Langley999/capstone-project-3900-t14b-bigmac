import React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

/**
 * @returns a success message in a snackbar popup at the bottom of the screen
 */
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

  const handleClose = (event, reason) => {
    setSnackBarOpen(false);
  };
  return (
    <Snackbar  sx={{}} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={snackBarOpen}  onClose={handleClose} autoHideDuration={1500} >
      <Alert severity='success' style={{successStyle, backgroundColor: '#edf7ec'}} sx={{ width: '100%' }} onClose={handleClose}>
        {successMsg}
      </Alert>
    </Snackbar>
  )
}

export default SuccessPopup;