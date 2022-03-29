import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import {CardMedia} from "@material-ui/core";
import banner from '../assets/banner.png'
import React, { useState, useRef, useEffect } from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import {url} from "./Helper";


export const AvatarBanner = ({userInfo}) => {
  const urlParams = useParams();
  const [target, setTarget] = useState({});

  useEffect(async () => {
    const user_id = Number(window.location.pathname.split('/')[2]);

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
  }, [window.location.href, userInfo])


  return (
    <Card>
      <CardMedia
        component="img"
        alt="Contemplative Reptile"
        height="100"
        image={banner}
        title="Contemplative Reptile"
      />
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: '25px'
          }}
        >
          <Avatar
            src={target.avatar}
            sx={{
              height: 64,
              mb: 2,
              width: 64
            }}
          />
          <Typography
            color="textPrimary"
            variant="h5"
          >
            {target.username}
          </Typography>
        </Box>
      </CardContent>
      <Divider/>
    </Card>
  )
};
