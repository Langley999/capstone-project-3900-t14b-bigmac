import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from "axios";
import {url} from "./Helper";
import { useNavigate } from 'react-router-dom';

const VerifyPopup = ({setShowVerify, username, email, password, setErrorMsg, setSnackBarOpen, updateLogin, updateUserInfo}) => {
  const [code, setCode] = React.useState(0);
  const navigate = useNavigate();

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
      updateLogin(true);
      updateUserInfo({
        user_id: response.data.user_id,
        email: email,
        username: username,
        password: password,
        avatar: ''
      });
      localStorage.setItem('user', JSON.stringify({
        user_id: response.data.user_id,
        email: email,
        username: username,
        password: password,
        avatar: ''
      }));
      localStorage.setItem('token', response.data.token);
      
      navigate('/');
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
    height: "275px",
    top: "50%",
    left: "50%",
    marginTop: "-225px",
    marginLeft: "-225px",
    backgroundColor: "white",
    outline: "1px solid grey",
    borderRadius: "15px",
    padding: "50px",
    zIndex: 5,
    textAlign: "center",
    verticalAlign: "center"
  }
  return (
    <div>
      <div style={{position: "fixed", width: "100%", height: "100%", backgroundColor: "black", opacity: 0.3,  zIndex: 4, top: 0, left: 0}}></div>
      <div style={popupStyle}>
        <IconButton style={{position: "fixed", marginLeft: "165px", marginTop: "-30px"}} onClick={closeVerify}>
          <CloseIcon/>
        </IconButton>
        <h1>Verify Your Email</h1>
        <p style={{marginBottom: "20px"}}>Enter the verification code sent to your email</p>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '300px'},
          }}
          noValidate
          autoComplete="off"
          onSubmit={(e) => submitCode(e)}
        >
          <TextField type="number" onChange={e => setCode(e.target.value)} id="outlined-basic" label="Code" variant="outlined" />
          <Button variant="contained" type="submit" style={{width: "300px", marginTop: "20px"}} >Submit Code</Button>
        </Box>
      </div>
    </div>
  )
}

export default VerifyPopup;