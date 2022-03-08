import React from 'react';
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


const Register = () => {
  // sets password and its visibility
  const [pass, setPass] = React.useState({password: '', showPassword: false});
  const [passConfirm, setPassConfirm] = React.useState({password: '', showPassword: false});

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

  const pressRegister = () => {
    // await fetch('', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `${token}`,
    //   },
    //   body: JSON.stringify({

    //   })
    // })
  }

  // style of the login form box
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
          />
          <TextField
            required
            id="outlined-email"
            label="Email"
            type="email"
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

          <Button variant="contained">Register</Button>
        </Box>
      </div>
    );
  };
export default Register;