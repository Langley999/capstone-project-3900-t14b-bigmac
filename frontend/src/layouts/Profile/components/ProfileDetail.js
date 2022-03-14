import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import {url, checkProfileInput} from '../../../components/Helper';

export const ProfileDetail = ({updateUserInfo, userInfo}) => {
  const [values, setValues] = useState({});
  const [ifVisible, setIfVisible] = useState(false);
  const [ifShow, setIfShow] = useState(false);

  useEffect(async () => {
    setValues(userInfo);
  }, [])


  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleChangePwd = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const clickShowPassword = () => {
    setIfVisible(!ifVisible);

  };

  const mouseDownPassword = (event) => {
    event.preventDefault();
  }

  const handleSubmit = () => {
    const errorMsg = checkProfileInput(values.username, values.email,values.password);
    if (errorMsg !== '') {
      alert(errorMsg);
      return
    }

    axios.post(`${url}/user/update`, {
      origin: userInfo.email,
      token: localStorage.getItem('token'),
      email: values.email,
      username: values.username,
      password: values.password
    }).then(function (response) {
      updateUserInfo(values);
      alert("Edit profile success!")
    }).catch(function (error) {
      alert(error.response.data);
    });
  }

  return (
    <form
      autoComplete="off"
      noValidate
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Account Profile"
        />
        <Divider />
        <CardContent>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '30px',
            }}
          >
            <Box
              display='flex'
              flexDirection='row'
              justifyContent="flex-start"
              width='100%'
            >
              < Typography
                color='#616161'
              >
                Badge: Empty
              </ Typography>
            </Box>
            <TextField
              fullWidth
              label="username"
              name="username"
              onChange={handleChange}
              required
              value={values.username ?? ''}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              onChange={handleChange}
              required
              value={values.email ?? ''}
              variant="outlined"
            />
            <FormControl
              sx={{ m: 1, width: '100%'}}
              variant="outlined"
            >
              <InputLabel htmlFor="input-password">Password</InputLabel>
              <OutlinedInput
                fullWidth
                id="input-password"
                type={ifVisible ? 'text' : 'password'}
                value={values.password ?? ''}
                onChange={handleChangePwd('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={clickShowPassword}
                      onMouseDown={mouseDownPassword}
                      edge="end"
                    >
                      {ifVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </Box>
        </CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
          >
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};