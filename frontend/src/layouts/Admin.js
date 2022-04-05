import React, { useState, useRef } from 'react';
import { url } from '../components/Helper'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import ErrorPopup from '../components/ErrorPopup';
import Stack from '@mui/material/Stack';
import HomeButton from '../components/HomeButton';
import {checkProfileInput} from '../components/Helper';



const Admin = () => {

  // sets password and its visibility
  const [pass, setPass] = React.useState({password: '', showPassword: false});
  const [id, setId] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);

  const navigate = useNavigate();

  const handlePassChange = (prop) => (event) => {
    setPass({ ...pass, [prop]: event.target.value });
  };

  // toggle password visibility
  const handleClickShowPassword = () => {
    setPass({...pass, showPassword: !pass.showPassword});
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const submitLogin = (e) => {
    e.preventDefault();
    // shows error message for 5 secs if any input is blank
    if (id === '' || pass.password === '') {
      setErrorMsg('All input fields must be filled');
      setSnackBarOpen(true);
      return;
    }
    console.log(pass);
    const body = JSON.stringify( {
      admin_id: id,
      password: pass['password'],
    });
    axios.post('http://127.0.0.1:8080/admin/login', body,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      localStorage.setItem('admin_id', response['data']['id']);
      localStorage.setItem('admin_token', response['data']['token']);
      navigate('/bookstation/allquiz');

    })
    .catch(function (error) {
      //console.log(JSON.stringify(error));
      setErrorMsg("Invalid admin id or password!");
      setSnackBarOpen(true);
    });

   
  }

  // style of the login form box
  const formStyle = {
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column",
    width: "400px",
    height: "450px",
    position: "fixed",
    top: "50%",
    left: "50%",
    marginTop: "-275px",
    marginLeft: "-270px",
    paddingLeft: "70px",
    paddingRight: "70px",
    paddingBottom: "30px",
    outline: "1px solid grey",
    borderRadius: "15px"
  }

  const headingStyle = {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    marginLeft: "-10px"
  }

    return (
      <div>
        <ErrorPopup errorMsg={errorMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen} />
        <Box
          component="form"
          noValidate
          autoComplete="off"
          style={formStyle}
          onSubmit={(e) => submitLogin(e)}
        >
          <Stack direction="row" style={headingStyle}>
            <HomeButton/>
            <h1 style={{textAlign: "center"}}>Admin Login</h1>
            <div style={{width: "30px"}}></div>
          </Stack>
          
          <TextField
            required
            id="outlined-email"
            label="Admin ID"
            type="id"
            onChange={e => setId(e.target.value)}
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={pass.showPassword ? 'text' : 'password'}
              value={pass.password}
              onChange={handlePassChange('password')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {pass.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <Button variant="contained" type="submit">Login</Button>
          <span style={{height: "20px", textAlign: "center"}}>Login as a user? <a href="http://localhost:3000/bookstation/login">Login</a></span>
        </Box>
      </div>
    );
  };
export default Admin;