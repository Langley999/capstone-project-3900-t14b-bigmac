import React from 'react';
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

/**
 * Login page with inputs for email and password and links to redirect to register or admin login
 * @param {Function} updateLogin sets whether login is true or false
 * @param {Function} updateUserInfo sets stored user information
 * @returns login input form
 */
const Login = ({ updateLogin, updateUserInfo }) => {

  const [pass, setPass] = React.useState({password: '', showPassword: false});
  const [email, setEmail] = React.useState('');
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

  // if inputs are valid, login post request is called
  const submitLogin = (e) => {
    e.preventDefault();
    // shows error message for 5 secs if any input is blank
    if (email === '' || pass.password === '') {
      setErrorMsg('All input fields must be filled');
      setSnackBarOpen(true);
      return;
    }
    // shows error message for 5 secs if any input is invalid
    const checkInputs = checkProfileInput('username', email, pass.password);
    if (checkInputs !== '') {
      setErrorMsg(checkInputs);
      setSnackBarOpen(true);
      return;
    }

    axios.post(`${url}/auth/login`, {
      email: email,
      password: pass.password
    }).then(function (response) {
      updateLogin(true);
      localStorage.setItem('token', response['data']['token']);

      axios.get(`${url}/user/profile`, {params: {
          user_id: response.data.user_id,
          token: response.data.token
        }})
        .then(function (res) {
          updateUserInfo({
            email: email,
            user_id: response.data.user_id,
            username: res.data.username,
            password: pass.password,
            avatar: res.data.avatar,
            badges: res.data.badges
          });
          localStorage.setItem('user', JSON.stringify({
            email: email,
            user_id: response.data.user_id,
            username: res.data.username,
            password: pass.password,
            avatar: res.data.avatar,
            badges: res.data.badges
          }));
          navigate('/');
        })

    }).catch(function (error) {
      // show server error message popup
      setErrorMsg(JSON.stringify(error.response.data.message));
      setSnackBarOpen(true);
    });
  }

  // style of the login form box
  const formStyle = {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    width: '400px',
    height: '450px',
    position: 'fixed',
    top: '50%',
    left: '50%',
    marginTop: '-275px',
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
        <ErrorPopup errorMsg={errorMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen} />
        <Box
          component='form'
          noValidate
          autoComplete='off'
          style={formStyle}
          onSubmit={(e) => submitLogin(e)}
        >
          <Stack direction='row' style={headingStyle}>
            <HomeButton/>
            <h1 style={{textAlign: 'center'}}>Login</h1>
            <div style={{width: '30px'}}></div>
          </Stack>
          
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

          <Button variant='contained' type='submit'>Login</Button>
          <div style={{textAlign: 'center'}}>
            <span>Don't have an account? <a href='http://localhost:3000/bookstation/register'>Register</a></span>
            <br/>
            <span>Login as admin <a href='http://localhost:3000/bookstation/admin'>here</a></span>
          </div>
        </Box>
      </div>
    );
  };
export default Login;