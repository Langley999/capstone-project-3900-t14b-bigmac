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

export const ProfileAvatar = ({userInfo, updateUserInfo}) => {
  const [values, setValues] = useState({});

  useEffect(async () => {
    setValues(userInfo);
    console.log(values)
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
      >
        3 followings
      </Button>
      <Button
        fullWidth
        variant="text"
      >
        4 followers
      </Button>
    </Card>
  )
}