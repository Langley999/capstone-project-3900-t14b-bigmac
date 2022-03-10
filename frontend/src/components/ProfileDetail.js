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

export const ProfileDetail = ({updateUserInfo, userInfo}) => {
  const [values, setValues] = useState({});
  const [ifVisible, setIfVisible] = useState(false);
  const [ifShow, setIfShow] = useState(false);

  useEffect(async () => {
    setValues(userInfo);
    console.log(values)
  }, [])

  const handleIfShow = () => {
    setIfShow(true);
  }

  const getButtonStatus = () => {
    if (ifShow)
      return 'none';
    else
      return 'block';
  }

  const getPasswordFieldStatus = () => {
    if (ifShow)
      return 'block';
    else
      return 'none';
  }


  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
    console.log(values);
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
    updateUserInfo(values);
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
              label="Username"
              name="userName"
              onChange={handleChange}
              required
              value={values.userName}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email"
              name="userEmail"
              onChange={handleChange}
              required
              value={values.userEmail}
              variant="outlined"
            />
            <Button sx={{
              display: getButtonStatus
            }}
              onClick={handleIfShow}
            >
              Change Password
            </Button>
            <FormControl
              sx={{ m: 1, width: '100%', display: getPasswordFieldStatus}}
              variant="outlined"
            >
              <InputLabel htmlFor="input-password">Password</InputLabel>
              <OutlinedInput
                fullWidth
                id="input-password"
                type={ifVisible ? 'text' : 'password'}
                value={values.userPassword}
                onChange={handleChangePwd('userPassword')}
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
