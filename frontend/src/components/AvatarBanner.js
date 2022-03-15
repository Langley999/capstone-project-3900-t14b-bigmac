import {
  Avatar,
  Box,
<<<<<<< HEAD
  Button,
  Card,
  CardActions,
=======
  Card,
>>>>>>> ready to demo
  CardContent,
  Divider,
  Typography
} from '@mui/material';
<<<<<<< HEAD



export const AvatarBanner = () => (
  <div className='centre'>
    <Card >
      <CardContent>
        <Box
          sx={{
            alignItems: 'left',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
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
            sx={{
              height: 64,
              mb: 2,
              width: 64
            }}
          />
          <Typography
            color="textPrimary"
<<<<<<< HEAD
            gutterBottom
            variant="h5"
          >
            {localStorage.getItem('userName')}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
    </Card>
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
