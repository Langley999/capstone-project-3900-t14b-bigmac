import React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

/**
 * @returns an warning message in a snackbar popup at the bottom of the screen
 */
const WarningPopup = ({ warningMsg, snackBarOpen, setSnackBarOpen }) => {

  // do nothing if message is empty
  if (warningMsg === '' || typeof warningMsg === 'undefined') {
    return null;
  }

  const handleClose = (event, reason) => {
    setSnackBarOpen(false);
  };
  
  const warningStyle = {
    background: '#ff9800',
    border: 0,
    borderRadius: 3,
    color: 'white',
    padding: '0 30px',
  }

  return (
    <Snackbar  sx={{}} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={snackBarOpen}  onClose={handleClose} autoHideDuration={1500} >
      <Alert severity='error' style={warningStyle}  sx={{ width: '100%' }} >
        {warningMsg }
      </Alert>
    </Snackbar>
  )
}

export default WarningPopup;