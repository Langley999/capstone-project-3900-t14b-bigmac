import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import {Link} from 'react-router-dom';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import Avatar from '@mui/material/Avatar';
import { styled } from '@material-ui/core';


const StyledBadge = styled(Badge)({
  '& .MuiBadge-badge': {
    color: 'white',
    backgroundColor: 'grey',
    fontSize: 13
  }
});

/**
 * Format review contents
 */
const ReviewContent = ({item,i}) => {
  const createDate = (str) => {
    let li = str.split(' ');
    let time = li[1];
    const date = new Date(li[0].replace(/-/g,'/'));
    return date;
  }
  const formatAMPM = (str) => {
    let li = str.split(' ');
    let time = li[1].split(':');
    let hours = time[0];
    let minutes = time[1];
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let strTime = hours + ':' + minutes + ampm;
    return strTime;

  }
  return (
    <Grid container direction='row' spacing={3} key={i} style={{ marginBottom: 20 }} >
    <Grid item xs={1}>
    <Avatar  variant='square' sx={{
          mt:2
        }}>
      <Box
        component='img'
        alt='avatar'
        sx={{
          width: 50,
          my:1
        }}
        src={(item['avatar']===null || item['avatar']==='') ?'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png':item['avatar']} 
      />                      
    </Avatar>

    </Grid>
    <Grid item xs={10}>
      <Grid container direction='row' spacing={0}>
        <Grid item xs={5}>
              <StyledBadge style={{color: '#00AFD7', marginRight: '15px'}} showZero badgeContent={item['badges'].length} color='primary'>
                <MilitaryTechIcon style={{ color: '#FF9900' }} fontSize='large' />
              </StyledBadge>
          {localStorage.getItem('token')==null ?
            <Button disabled='true' style={{textTransform: 'none', fontSize:'16px',width:'100px',justifyContent: 'flex-start'}}>
              {item['username']} </Button>
            : <Button component = {Link} to={`/user/${item['user_id']}/profile`} style={{textTransform: 'none', fontSize:'16px',width:'100px',justifyContent: 'flex-start'}}>
               {item['username']}</Button>
            }
   
        </Grid>

        <Grid item xs={3}>
          <Rating
            size='small'
            value={item['rating']}
            readOnly
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant='subtitle2' style={{ fontWeight: 600 }} display='block' gutterBottom> {formatAMPM(item['time'])} {createDate(item['time']).toLocaleDateString('en-AU')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='body2' display='block' gutterBottom>
            {item['content']}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
   
  </Grid>)

}
export default ReviewContent;