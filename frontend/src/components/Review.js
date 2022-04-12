import axios from "axios";
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import Popover from '@mui/material/Popover';
import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { makeStyles } from '@mui/styles';

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import IconButton from '@mui/material/IconButton';
import {Link, useParams} from "react-router-dom";
import LightbulbIcon from '@mui/icons-material/Lightbulb';

import Avatar from '@mui/material/Avatar';
import { styled } from "@material-ui/core";

const StyledBadge = styled(Badge)({
  "& .MuiBadge-badge": {
    color: "white",
    backgroundColor: "grey",
    fontSize: 13
  }
});

const Review = ({item,i}) => {

  const createDate = (str) => {
    let li = str.split(' ');
    let time = li[1];
    const date = new Date(li[0].replace(/-/g,"/"));
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
    <Grid container direction="row" spacing={3} key={i} style={{ marginBottom: 20 }} >
    <Grid item xs={1}>
    <Avatar  variant="square" sx={{
          mt:2
        }}>
      <Box
        component="img"
        alt="avatar"
        sx={{
          width: 50,
          my:1
        }}
        src={(item['avatar']===null || item['avatar']==="") ?"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png":item['avatar']} 
      />                      
    </Avatar>

    </Grid>
    <Grid item xs={10}>
      <Grid container direction="row" spacing={0}>
        <Grid item xs={5}>
          
          {localStorage.getItem('token')==null ?
            <Button disabled="true" style={{textTransform: "none", fontSize:"16px",width:"100px",justifyContent: "flex-start"}}>{item['username']} 
              <StyledBadge style={{color: '#00AFD7'}}showZero badgeContent={item['badges'].length} color="primary">
                <LightbulbIcon style={{ color: '#FF9900' }} />
              </StyledBadge> </Button>
            : <Button component = {Link} to={`/user/${item['user_id']}/profile`} style={{textTransform: "none", fontSize:"16px",width:"100px",justifyContent: "flex-start"}}>{item['username']}
              <StyledBadge  showZero style={{color: '#00AFD7'}} badgeContent={item['badges'].length} color="primary">
                <LightbulbIcon style={{ color: '#FF9900' }} />
              </StyledBadge> </Button>
            }
   
        </Grid>

        <Grid item xs={4}>
          <Typography variant="subtitle2" style={{ fontWeight: 600 }} display="block" gutterBottom> {formatAMPM(item['time'])} {createDate(item['time']).toLocaleDateString("en-AU")}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Rating
            size="small"
            value={item['rating']}
            readOnly
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" display="block" gutterBottom>
            {item['content']}
          </Typography>
        </Grid>

      </Grid>
     


    </Grid>
   
  </Grid>)

}
export default Review;