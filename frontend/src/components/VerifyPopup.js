import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const VerifyPopup = () => {
  const popupStyle = {
    position: "fixed",
    width: "800px",
    height: "575px",
    top: "50%",
    left: "50%",
    marginTop: "-300px",
    marginLeft: "-450px",
    backgroundColor: "white",
    outline: "1px solid grey",
    borderRadius: "15px",
    padding: "50px",
    zIndex: 5
  }
  return (
    <div>
      <div style={{position: "fixed", width: "100%", height: "100%", backgroundColor: "black", opacity: 0.3,  zIndex: 4, top: 0, left: 0}}></div>
      <div style={popupStyle}>
        <IconButton style={{position: "fixed", marginLeft: "790px", marginTop: "-30px"}} onClick={hideFollowers}>
          <CloseIcon/>
        </IconButton>
        <h1>Verify Your Email</h1>
        <p>Enter the verification code sent to your email</p>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField id="outlined-basic" label="Code" variant="outlined" />
        </Box>
      </div>
    </div>
  )
}