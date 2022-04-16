import React from 'react';
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
import Stack from '@mui/material/Stack';
import HomeButton from '../components/HomeButton';
import ErrorPopup from '../components/ErrorPopup';
import {checkProfileInput} from '../components/Helper';
import VerifyPopup from '../components/VerifyPopup';

/**
 * Register page with inputs for username, email, password and confirm password
 * When register form is submitted, an email verification popup appears
 * This page has a link to redirect to login page
 * @param {Function} updateLogin sets whether login is true or false
 * @param {Function} updateUserInfo sets stored user information
 * @returns register input form
 */
const Register = ({ updateLogin, updateUserInfo }) => {

  const [pass, setPass] = React.useState({password: '', showPassword: false});
  const [passConfirm, setPassConfirm] = React.useState({password: '', showPassword: false});
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [passErr, setPassErr] = React.useState('');
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [showVerify, setShowVerify] = React.useState(false);

  // handle password changes
  const handlePassChange = (prop) => (event) => {
    setPass({ ...pass, [prop]: event.target.value });
  };
  const handlePassConfirmChange = (prop) => (event) => {
    setPassConfirm({ ...passConfirm, [prop]: event.target.value });
  };

  // toggle password visibility
  const handleClickShowPassword = () => {
    setPass({...pass, showPassword: !pass.showPassword});
  };
  const handleClickShowPasswordConfirm = () => {
    setPassConfirm({...passConfirm, showPassword: !passConfirm.showPassword});
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // If inputs are valid, send post request to register and send a code to the entered email
  const submitRegister = (e) => {
    e.preventDefault();
    // show error message for 5 secs if any inputs are blank
    if (email === '' || username === '' || pass.password === '' || passConfirm.password === '') {
      setErrorMsg('All input fields must be filled');
      setSnackBarOpen(true);
      return;
    }
    // set error message and return if passwords are not empty and don't match
    if (pass.password !== '' && passConfirm.password !== '' && pass.password !== passConfirm.password) {
      setErrorMsg('Password and confirm password must match');
      setSnackBarOpen(true);
      return;
    }
    // set error message for any invalid inputs
    const checkInputs = checkProfileInput(username, email, pass.password);
    if (checkInputs !== '') {
      setErrorMsg(checkInputs);
      setSnackBarOpen(true);
      return;
    }

    axios.post('http://127.0.0.1:8080/auth/register', {
      username: username,
      email: email,
      password: pass.password
    }).then(function(response) {
      if (response.data.valid_user) {
        axios.post('http://127.0.0.1:8080/auth/sendCode', {
          email: email
        }).then(function(response) {
          if (response.data.sent_email) {
            setShowVerify(true);
          }
        }).catch(function (error) {
          setErrorMsg(JSON.stringify(error.response.data.message));
          setSnackBarOpen(true);
        })
      }
    }).catch(function(error) {
      setErrorMsg(JSON.stringify(error.response.data.message));
      setSnackBarOpen(true);
    });
  }

  // style of the register form box
  const formStyle = {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    width: '400px',
    height: '625px',
    position: 'fixed',
    top: '50%',
    left: '50%',
    marginTop: '-325px',
    marginLeft: '-270px',
    paddingLeft: '70px',
    paddingRight: '70px',
    paddingBottom: '30px',
    outline: '1px solid grey',
    borderRadius: '15px'
  }

  const headingStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: '-10px'
  }

  return (
    <div>
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen}/>
      <Box
        component='form'
        noValidate
        autoComplete='off'
        style={formStyle}
        onSubmit={(e) => submitRegister(e)}
      >
        <Stack direction='row' style={headingStyle}>
          <HomeButton/>
          <h1 style={{textAlign: 'center'}}>Register</h1>
          <div style={{width: '20px'}}/>
        </Stack>
        <TextField
          required
          id='outlined-username'
          label='Username'
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          required
          id='outlined-email'
          label='Email'
          type='email'
          onChange={e => setEmail(e.target.value)}
        />
        <FormControl variant='outlined'>
          <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
          <OutlinedInput
            id='outlined-adornment-password'
            type={pass.showPassword ? 'text' : 'password'}
            value={pass.password}
            helperText={passErr}
            onChange={handlePassChange('password')}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {pass.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label='Password'
          />
        </FormControl>
        <FormControl variant='outlined'>
          <InputLabel htmlFor='outlined-adornment-password'>Confirm Password</InputLabel>
          <OutlinedInput
            id='outlined-adornment-password2'
            type={passConfirm.showPassword ? 'text' : 'password'}
            value={passConfirm.password}
            onChange={handlePassConfirmChange('password')}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPasswordConfirm}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {passConfirm.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label='Confirm Password'
          />
        </FormControl>

        <Button variant='contained' type='submit'>Register</Button>
        <div style={{textAlign: 'center'}}>
          <span>Already have an account? <a href='http://localhost:3000/bookstation/login'>Login</a></span>
          <br/>
          <span>Login as admin <a href='http://localhost:3000/bookstation/admin'>here</a></span>
        </div>
      </Box>
      {showVerify ? <VerifyPopup setShowVerify={setShowVerify} username={username} email={email} password={pass.password} setErrorMsg={setErrorMsg} setSnackBarOpen={setSnackBarOpen} updateLogin={updateLogin} updateUserInfo={updateUserInfo} /> : <></>}
    </div>
  );
};
export default Register;