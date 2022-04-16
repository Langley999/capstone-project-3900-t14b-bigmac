import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
  Avatar
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import ErrorPopup from '../../../components/ErrorPopup';
import {url, checkProfileInput} from '../../../components/Helper';
import {useParams} from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';

/**
 * Showing the user's profile detail in profile page
 */
export const ProfileDetail = ({updateUserInfo, userInfo}) => {
  const params = useParams();
  const [values, setValues] = useState({});
  const [ifVisible, setIfVisible] = useState(false);
  const [isSelf, setIsSelf] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentBadge, setCurrentBadge] = useState({});
  const [openBadge, setOpenBadge] = useState(false);

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
        if (user_id === userInfo.user_id) {
          setValues({
            ...userInfo,
            badges: res.data.badges
          });
        } else {
          setValues({
            username: res['data']['username'],
            avatar: res.data.avatar,
            badges: res.data.badges
          });
        }
      })
      .catch(function (error) {
        setShowError(true);
        setErrorMsg(error.message);
      });

  }, [window.location.href, userInfo]);

  const handleClickOpenBadge = () => {
    setOpenBadge(true);
  };

  const handleCloseBadge = () => {
    setOpenBadge(false);
  };


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
        avatar: userInfo.avatar,
        badges: userInfo.badges
      }))
      setSuccessMsg('Profile details updated');
      setShowSuccess(true);
      
    }).catch(function (error) {
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

  const openBadgeInfo = (badge) => {
    handleClickOpenBadge();
    setCurrentBadge(badge);
  }

  return (
    <>
    {values.badges && 
      <div>
      <Dialog open={openBadge} onClose={handleCloseBadge}>
        <DialogTitle>Badge Information</DialogTitle>
        <DialogContent>
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Avatar src={currentBadge.badge_image} sx={{height: 50, width: 50}}/>
            <Typography><b>Quiz:</b> {currentBadge.quiz_name}</Typography>
            <Typography><b>Quiz Description:</b></Typography>
            <Typography>{currentBadge.quiz_description}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            onClick={handleCloseBadge}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError}/>
      <Snackbar  sx={{ height: '100%' }} anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={showSuccess}  onClose = {() => setShowSuccess(false)} autoHideDuration={1500} >
        <Alert severity='success' style={{successStyle}} sx={{ width: '100%' }} >
          {successMsg}
        </Alert>
      </Snackbar>
      {isSelf ?
        <form
          autoComplete='off'
          noValidate
        >

          <Card>
            <CardHeader
              subheader='The information can be edited'
              title='Account Profile'
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
                  justifyContent='flex-start'
                  width='100%'
                >
                  < Typography
                    color='#616161'
                    sx={{marginRight: '10px'}}
                  >
                    Badges:
                  </ Typography>
                  {values.badges.length > 0 ? values.badges.map((badge) => {
                    return (
                      <IconButton onClick={() => openBadgeInfo(badge)}>
                        <Avatar src={badge.badge_image} key={badge.badge_id} sx={{height: 50, width: 50}}/>
                      </IconButton>
                    )
                  }) : <Typography>Empty</Typography>}
                </Box>
                <TextField
                  disabled
                  fullWidth
                  label='Email'
                  name='email'
                  onChange={handleChange}
                  value={values.email ?? ''}
                  variant='outlined'
                />
                <TextField
                  fullWidth
                  label='Username'
                  name='username'
                  onChange={handleChange}
                  value={values.username ?? ''}
                  variant='outlined'
                />
                <FormControl
                  sx={{ m: 1, width: '100%'}}
                  variant='outlined'
                >
                  <InputLabel htmlFor='input-password'>Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id='input-password'
                    type={ifVisible ? 'text' : 'password'}
                    value={values.password ?? ''}
                    onChange={handleChangePwd('password')}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={clickShowPassword}
                          onMouseDown={mouseDownPassword}
                          edge='end'
                        >
                          {ifVisible ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label='Password'
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
                color='primary'
                variant='contained'
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
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
              }}
            > 
              < Typography
                color='#616161'
                variant='h5'
                sx={{marginRight: '10px', textAlign: 'center'}}
              >
                Badge Collection:
              </ Typography>
                <br/>
                <Box
                  display='flex'
                  flexDirection='row'
                  justifyContent='center'
                  width='100%'
                >
                {values.badges.length > 0 ? values.badges.map((badge) => {
                  return ( 
                    <IconButton onClick={() => openBadgeInfo(badge)}>
                      <Avatar src={badge.badge_image} key={badge.badge_id} sx={{height: 50, width: 50}}/>
                    </IconButton>
                  )
                }) : <Typography>Empty</Typography>}
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
      </div>}
    </>
  );
};
