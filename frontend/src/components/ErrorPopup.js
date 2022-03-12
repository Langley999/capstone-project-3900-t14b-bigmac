import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

// Shows an error message in a popup at the top of the screen
const ErrorPopup = ({ errorMsg }) => {
  // do nothing if message is empty
  if (errorMsg === '' || typeof errorMsg === 'undefined') {
    return null;
  }

  const errorStyle = {
    position: "fixed",
    paddingTop: "15px",
    paddingLeft: "20px",
    width: "97%",
  }

  return (
    <Stack sx={{ width: '100%' }} spacing={2} style={errorStyle}>
      <Alert severity="error" style={{backgroundColor: "#fceded" }}>
        <AlertTitle>Error</AlertTitle>
        {errorMsg}
      </Alert>
    </Stack>
  )
}

export default ErrorPopup;