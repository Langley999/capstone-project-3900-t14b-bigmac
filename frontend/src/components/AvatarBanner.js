import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import {CardMedia} from '@material-ui/core';
import banner from '../assets/banner.png';
import banner2 from '../assets/banner2.jpeg';
import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {url} from './Helper';

/**
 * Showing the user's avatar, username and a banner in user's profile
 */
export const AvatarBanner = ({userInfo}) => {
  const urlParams = useParams();
  const [target, setTarget] = useState({});
  const user_id = Number(window.location.pathname.split('/')[2]);

  useEffect(async () => {

    axios.get(`${url}/user/profile`, {params: {
        user_id: user_id,
        token: localStorage.getItem('token')
      }})
      .then(function (res) {
        if (user_id === userInfo.user_id) {
          setTarget(userInfo);
        }
        else
          setTarget({
            username: res.data.username,
            avatar: res.data.avatar
          });
      });
  }, [window.location.href, userInfo]);


  return (
    <Card>
      <CardMedia
        component='img'
        alt='Contemplative Reptile'
        height='100'
        image={user_id === userInfo.user_id ? banner : banner2}
        title='Contemplative Reptile'
      />
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: '25px'
          }}
        >
          {target.avatar === undefined ?
          <Avatar fontSize='large'
          sx={{
            height: 64,
            mb: 2,
            width: 64
          }}
          /> :
          <Avatar
            src={target.avatar}
            sx={{
              height: 64,
              mb: 2,
              width: 64
            }}
          />}
          <Typography
            color='textPrimary'
            variant='h5'
          >
            {target.username}
          </Typography>
        </Box>
      </CardContent>
      <Divider/>
    </Card>
  )
};
