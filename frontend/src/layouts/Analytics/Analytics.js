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
import { useLocation } from 'react-router-dom';

/**
 * Analytics page that handles whether goals, friend or genre analytics are shown
 * @param {Object} userInfo information of the user who is logged in
 * @returns analytics page in user profile
 */
const Analytics = ({ userInfo }) => {
  const location = useLocation();
  const [id, setId] = React.useState(parseInt(location.pathname.split('/')[2]));
  const [analyticView, setAnalyticView] = React.useState(userInfo.user_id === id ? 'goals' : 'friends');

  // get id of user from url on refresh
  React.useEffect(() => {
    setId(parseInt(location.pathname.split('/')[2]));
  }, [location]);

  // sets the current analytic view depending on which option is clicked
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
          {userInfo.user_id === id ?
          <>
          <MenuItem>
            <ListItemText onClick={clickGoals}>Reading Goal</ListItemText>
          </MenuItem>
          <Divider/>
          </> :
          <></>}
          <MenuItem>
            <ListItemText onClick={clickFriends}>Friend Activity</ListItemText>
          </MenuItem>
          <Divider/>
          <MenuItem>
            <ListItemText onClick={clickGenres}>{userInfo.user_id === id ? <>Your</> : <>Their</>} Genres</ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
    )
  }

  // information corresponding to the selected analytics view
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
      <p>View {userInfo.user_id === id ? <>your</>:<>their</>} reading progress!</p>
      <Divider sx={{marginTop: '10px', marginBottom: '10px'}}/>
      {analyticView === 'goals' ? <GoalPage/> : <></>}
      {analyticView === 'friends' ? <FriendPage userInfo={userInfo}/> : <></>}
      {analyticView === 'genres' ? <GenrePage userInfo={userInfo}/> : <></>}
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