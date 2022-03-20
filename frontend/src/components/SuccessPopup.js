import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

// Shows an error message in a popup at the top of the screen
const SuccessPopup = ({ successMsg }) => {
  // do nothing if message is empty
  if (successMsg === '' || typeof successMsg === 'undefined') {
    return null;
  }

  const successStyle = {
    position: "fixed",
    paddingTop: "15px",
    paddingLeft: "20px",
    width: "97%"
  }

  return (
    <Stack sx={{ width: '100%' }} spacing={2} style={successStyle}>
      <Alert severity="success" style={{backgroundColor: "edf7ec"}}>
        <AlertTitle>Success</AlertTitle>
        {successMsg}
      </Alert>
    </Stack>
  )
}

export default SuccessPopup;