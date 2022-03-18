import React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import GoalPage from '../Analytics/GoalPage';
import GenrePage from '../Analytics/GenrePage';
import FriendPage from '../Analytics/FriendPage';

const Analytics = ({ userInfo }) => {
  // can be goals, friends or genres
  const [analyticView, setAnalyticView] = React.useState('goals');

  const clickGoals = () => {
    setAnalyticView('goals');
  }
  const clickFriends = () => {
    setAnalyticView('friends');
  }
  const clickGenres = () => {
    setAnalyticView('genres');
  }
  // sidebar with reading progress (goals), friends and genres
  const Sidebar = () => {
    return (
      <Paper sx={{ width: 200, maxWidth: '100%', height: 500, overflow: 'auto'}}>
        <MenuList>
          <MenuItem>
            <ListItemText onClick={clickGoals}>Reading Goal</ListItemText>
          </MenuItem>
          <Divider/>
          <MenuItem>
            <ListItemText onClick={clickFriends}>Friend Activity</ListItemText>
          </MenuItem>
          <Divider/>
          <MenuItem>
            <ListItemText onClick={clickGenres}>Your Genres</ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
    )
  }


  const Data = () => {
    return (
    <Paper sx={{
      width: '100%',
      height: '500px',
      marginLeft: '40px',
      padding: '20px',
      overflow: 'auto'
    }}>
      <h1>Analytics</h1>
      <p>View your monthly progress!</p>
      <Divider sx={{marginTop: '10px', marginBottom: '10px'}}/>
      <GoalPage display={analyticView} userInfo={userInfo}/>
      <FriendPage display={analyticView}/>
      <GenrePage display={analyticView}/>
    </Paper>
    )
  }

  return (
    <>
      <Box sx={{display: 'flex'}}>
        <Sidebar/>
        <Data/>
      </Box>
    </>
  );
};
export default Analytics;