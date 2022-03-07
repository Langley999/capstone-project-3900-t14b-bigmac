import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';



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
            sx={{
              height: 64,
              mb: 2,
              width: 64
            }}
          />
          <Typography
            color="textPrimary"
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
