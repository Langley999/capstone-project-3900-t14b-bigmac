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
import ErrorPopup from '../../../components/ErrorPopup';
import SuccessPopup from '../../../components/ErrorPopup';
import {url, checkProfileInput} from '../../../components/Helper';
import {useParams, useLocation, useNavigate} from "react-router-dom";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export const ProfileDetail = ({updateUserInfo, userInfo}) => {
  const params = useParams();
  const [values, setValues] = useState({});
  const [ifVisible, setIfVisible] = useState(false);
  const [isSelf, setIsSelf] = useState(true);

  const [ifShow, setIfShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(async () => {
    const user_id = Number(window.location.pathname.split('/')[2]);
    setIsSelf(user_id === userInfo.user_id);

    axios.get(`${url}/user/profile`, {
      params: {
        user_id: user_id,
        token: localStorage.getItem('token')
      }
    })
      .then(function (res) {
        console.log(res)
        if (user_id === userInfo.user_id) {
          setValues(userInfo);
        } else {
          setValues({
            username: res['data']['username'],
            avatar: res.data.avatar
          });
        }
      })
      .catch(function (error) {
        alert(error.response.data.message)
      });

  }, [window.location.href, userInfo])


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
    const checkInputs = checkProfileInput(values.username, values.email,values.password)
    if (checkInputs !== '') {
      setErrorMsg(checkInputs);
      setShowError(true);
      return;
    }

    axios.post(`${url}/user/update`, {
      token: localStorage.getItem('token'),
      username: values.username,
      password: values.password
    }).then(function (response) {
      updateUserInfo(values);
      localStorage.setItem('user', JSON.stringify({
        user_id: userInfo.user_id,
        email: values.email,
        username: values.username,
        password: values.password,
        avatar: userInfo.avatar
      }))
      setSuccessMsg('Profile details updated');
      setShowSuccess(true);
      
    }).catch(function (error) {
      console.log(error.message)
      setErrorMsg(JSON.stringify(error.message));
      setShowError(true);
    });
  }

  const successStyle = {
    background: '#2f7c31',
    border: 0,
    borderRadius: 3,
    color: 'white',
    padding: '0 30px'
  }

  return (
    <>
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError}/>
      <Snackbar  sx={{ height: "100%" }} anchorOrigin={{vertical: "top", horizontal: "center"}} open={showSuccess}  onClose = {() => setShowSuccess(false)} autoHideDuration={1500} >
        <Alert severity="success" style={{successStyle}} sx={{ width: '100%' }} >
          {successMsg}
        </Alert>
      </Snackbar>
      {isSelf ?
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
                  disabled
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  value={values.email ?? ''}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  onChange={handleChange}
                  value={values.username ?? ''}
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
                          {ifVisible ? <Visibility /> : <VisibilityOff />}
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
        :
        <Card sx={{height: '200px'}}>
          <CardContent>
            <Box
              sx={{
                alignItems: 'flex-start',
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
                  variant='h5'
                >
                  Badge: Empty
                </ Typography>
              </Box>
              < Typography
                color='#616161'
                variant='h5'
              >
                {`Username: ${values.username}`}
              </ Typography>
            </Box>
          </CardContent>
        </Card>
      }
    </>
  );
};
