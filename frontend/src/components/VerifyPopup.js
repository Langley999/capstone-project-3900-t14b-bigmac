import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from "axios";
import {url} from "./Helper";

const VerifyPopup = ({setShowVerify, username, email, password, setErrorMsg, setSnackBarOpen}) => {
  const [code, setCode] = React.useState(0);

  const submitCode = (e) => {
    console.log(code);
    e.preventDefault();
    axios.post(`${url}/auth/verified`, {
      username: username,
      email: email,
      password: password,
      user_code: code
    }).then(function (response) {
      // redirect to logged in home page
      console.log('code success');
    }).catch(function (error) {
      setErrorMsg(error.response.data.message);
      setSnackBarOpen(true);
    })
  }

  const closeVerify = () => {
    setShowVerify(false);
  }

  const popupStyle = {
    position: "fixed",
    width: "350px",
    height: "300px",
    top: "50%",
    left: "50%",
    marginTop: "-225px",
    marginLeft: "-225px",
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
        <IconButton style={{position: "fixed", marginLeft: "340px", marginTop: "-30px"}} onClick={closeVerify}>
          <CloseIcon/>
        </IconButton>
        <h1>Verify Your Email</h1>
        <p style={{marginBottom: "20px"}}>Enter the verification code sent to your email</p>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch'},
          }}
          noValidate
          autoComplete="off"
        >
          <TextField type="number" onChange={e => setCode(e.target.value)} id="outlined-basic" label="Code" variant="outlined" />
          <Button variant="contained" onClick={submitCode} >Submit Code</Button>
        </Box>
      </div>
    </div>
  )
}

export default VerifyPopup;