import { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
} from '@mui/material';
import {useParams} from "react-router-dom";
import axios from "axios";
import {url} from "../../../components/Helper";

export const ProfileAvatar = ({userInfo, updateUserInfo}) => {
  const urlParams = useParams();
  const user_id = Number(urlParams.userid);
  const [isSelf, setIsSelf] = useState(user_id === userInfo.user_id);

  const [values, setValues] = useState({});

  useEffect(async () => {
    axios.get(`${url}/user/profile`, {params: {
        user_id: user_id,
        token: localStorage.getItem('token')
      }})
      .then(function (res) {
        if (isSelf)
          setValues(userInfo);
        else {
          setValues({
            avatar: 'data:image/jpeg;base64,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'
          });
        }
      })
      .catch(function (error) {
        alert(error.response.data.message)
      });
  }, [])

  return (
    <Card>
      <CardContent
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Avatar
            src={values.avatar}
            sx={{
              height: 150,
              mb: 2,
              width: 150
            }}
          />
        </Box>
        <Button
          color="primary"
          variant='contained'
        >
          Upload Avatar
        </Button>
      </CardContent>
      <CardActions>
      </CardActions>
      <Divider />
      <Button
        color='warning'
        fullWidth
        variant="text"
        sx={{textTransform: "none"}}
      >
        3 followings
      </Button>
      <Button
        fullWidth
        variant="text"
        sx={{textTransform: "none"}}
      >
        4 followers
      </Button>
    </Card>
  )
}