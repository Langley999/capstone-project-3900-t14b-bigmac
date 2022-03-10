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
            src={userInfo.userAvatar}
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
            {userInfo.userName}
          </Typography>
        </Box>
      </CardContent>
      <Divider/>
    </Card>
  )
};
