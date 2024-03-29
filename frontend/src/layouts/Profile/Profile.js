import React from 'react';
import { Box, Container, Grid} from '@mui/material';
import { ProfileAvatar } from './components/ProfileAvatar';
import { ProfileDetail } from './components/ProfileDetail';

/**
 * Profile page for a user
 */
const Profile = ({userInfo, updateUserInfo}) => {
  return (
    <Box
      component='main'
      sx={{
        flexGrow: 1,
        py: 2
      }}
    >
      <Container maxWidth='lg'>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
          >
            <ProfileAvatar userInfo={userInfo} updateUserInfo={updateUserInfo} />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <ProfileDetail updateUserInfo={updateUserInfo} userInfo={userInfo}/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default Profile;