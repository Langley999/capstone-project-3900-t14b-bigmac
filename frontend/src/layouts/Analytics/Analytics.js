import React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Box from "@mui/material/Box";
import GoalPage from '../Analytics/GoalPage';

const Analytics = () => {

  // sidebar with reading progress (goals), friends and genres
  const Sidebar = () => {
    return (
      <Paper sx={{ width: 200, maxWidth: '100%', height: 500, overflow: 'auto'}}>
        <MenuList>
          <MenuItem>
            <ListItemText>Reading Goal</ListItemText>
          </MenuItem>
          <Divider/>
          <MenuItem>
            <ListItemText>Friend Activity</ListItemText>
          </MenuItem>
          <Divider/>
          <MenuItem>
            <ListItemText>Your Genres</ListItemText>
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
      <GoalPage/>
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