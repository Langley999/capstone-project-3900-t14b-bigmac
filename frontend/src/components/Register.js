import React from 'react';
import '../App.css'
import { useNavigate } from 'react-router-dom';
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



const Register = ({ updateLogin }) => {
  const navigate = useNavigate();

  const [pass, setPass] = React.useState({password: '', showPassword: false});
  const [passConfirm, setPassConfirm] = React.useState({password: '', showPassword: false});
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [passErr, setPassErr] = React.useState('');

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

  // checks if passwords match on blur
  const passwordMatchCheck = () => {
    if (password !== password2) {
      // show error
      setPassErr('Passwords must match');
    } else {
      setPassErr('');
    }
  }

  const pressRegister = async () => {
    // set error message and return if passwords are not empty and don't match
    if (pass !== '' && passConfirm !== '' && pass !== passConfirm) {
      setErrorMsg('Password and confirm password must match')
      return
    }
    // set error message and return if password not between 6 and 18 characters
    if (pass.length < 6 || pass.length > 18) {
      setErrorMsg('Password must be between 6 and 18 characters')
      return
    }
    await fetch('http://127.0.0.1:8080/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        username,
        password: pass.password,
        confirmPassword: passConfirm.password
      })
    })
    const data = await r.json();
    if (typeof data.message !== 'undefined') {
      // show error
      console.log(data.message)
      setErrorMsg(data.message)
    } else {
      loginSuccess()
    }
  }

  const loginSuccess = () => {
    updateLogin(true);
    navigate('/');
  }

  // style of the register form box
  const formStyle = {
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column",
    width: "400px",
    height: "600px",
    position: "fixed",
    top: "50%",
    left: "50%",
    marginTop: "-300px",
    marginLeft: "-270px",
    paddingLeft: "70px",
    paddingRight: "70px",
    paddingBottom: "30px",
    outline: "1px solid grey",
    borderRadius: "15px"
  }

  return (
    <div>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          style={formStyle}
        >
          <h1>Register</h1>
          <TextField
            required
            id="outlined-username"
            label="Username"
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            required
            id="outlined-email"
            label="Email"
            type="email"
            onChange={e => setEmail(e.target.value)}
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={pass.showPassword ? 'text' : 'password'}
              value={pass.password}
              helperText={passErr}
              onChange={handlePassChange('password')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {pass.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password2"
              type={passConfirm.showPassword ? 'text' : 'password'}
              value={passConfirm.password}
              onChange={handlePassConfirmChange('password')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasswordConfirm}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {passConfirm.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
          </FormControl>

          <Button variant="contained" onClick={pressRegister}>Register</Button>
        </Box>
      </div>
  );
};
export default Register;