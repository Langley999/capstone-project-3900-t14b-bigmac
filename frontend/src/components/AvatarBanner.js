import {
  Avatar,
  Box,
<<<<<<< HEAD
<<<<<<< HEAD
  Button,
  Card,
  CardActions,
=======
  Card,
>>>>>>> ready to demo
=======
  Card,
>>>>>>> update profile
  CardContent,
  Divider,
  Typography
} from '@mui/material';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import {CardMedia} from "@material-ui/core";
import banner from '../assets/banner.png'
>>>>>>> update profile


export const AvatarBanner = ({userInfo}) => {

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
<<<<<<< HEAD
            src={localStorage.getItem('userAvatar')}
=======
import {CardMedia} from "@material-ui/core";
import banner from '../assets/banner.png'


export const AvatarBanner = ({userInfo}) => {

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
            src={userInfo.avatar}
>>>>>>> ready to demo
=======
            src={userInfo.userAvatar}
>>>>>>> update profile
            sx={{
              height: 64,
              mb: 2,
              width: 64
            }}
          />
          <Typography
            color="textPrimary"
<<<<<<< HEAD
<<<<<<< HEAD
            gutterBottom
=======
>>>>>>> update profile
            variant="h5"
          >
            {userInfo.userName}
          </Typography>
        </Box>
      </CardContent>
      <Divider/>
    </Card>
<<<<<<< HEAD
  </div>
);
=======
            variant="h5"
          >
            {userInfo.username}
          </Typography>
        </Box>
      </CardContent>
      <Divider/>
    </Card>
  )
};
>>>>>>> ready to demo
=======
  )
};
>>>>>>> update profile
