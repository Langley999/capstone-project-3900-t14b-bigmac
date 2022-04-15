import React, { useState, useRef, useEffect } from 'react';
import { url } from '../components/Helper'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import ErrorPopup from '../components/ErrorPopup';
import Stack from '@mui/material/Stack';
import HomeButton from '../components/HomeButton';
import {checkProfileInput} from '../components/Helper';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Link, useParams} from "react-router-dom";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';

const Quiz = () => {
  const [allquiz,setAllquiz] = React.useState([]);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);

  const navigate = useNavigate();



  useEffect(() => {
    const quiz_id = Number(window.location.search.split('=')[1]);
    axios.get('http://127.0.0.1:8080/quiz/getopenquiz', {
      params: {
        token: localStorage.getItem('token')
      }
    })
    .then(function (response) {
      let data = response['data'];
      console.log(data);
      setAllquiz(data['quizzes']);
      
    }).catch(function (error) {
      setErrorMsg(error.response.data.message);
      setSnackBarOpen(true);
    });;
  }, [window.location.href]);
  return (
    <Box m={2} pt={2}>
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen} />
      <Grid container direction="column" spacing={12} justifyContent="center" >
        <Grid item  xs={12}>
          <Typography variant="h5" gutterBottom component="div">
            Current running quizzes
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {allquiz.length > 0 &&  allquiz.map((item, i) =>   
            <Grid container direction="row" spacing={1} justifyContent="center" sx={{ marginBottom:5 }} >
              <Grid item xs ={9} >
                <Grid container direction="row" spacing={1} justifyContent="left-satrt" >
                  <Grid item xs ={1}>
                    <Avatar src={item['badge_image']} />
                  </Grid>
                  <Grid item xs ={3}>
                    <Typography variant="body1" gutterBottom component="div">
                      <b>{item['quiz_name']}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs ={2}>
                    {item['complete_status'] === 0 &&
                      <Button variant="contained"  sx={{ width:110 }}  component = {Link} to={`/enterquiz/?id=${item['id']}`}>
                        Enter
                      </Button>}          
                      {item['complete_status'] === 1 &&
                      <Button sx={{ width:110 }} variant="contained" disabled>
                        PASSED
                      </Button>}    
                      {item['complete_status'] === 2 &&
                      <Button sx={{ width:110 }} variant="contained" disabled>
                        COMPLETED 
                      </Button>}
                  </Grid>
                </Grid>
              </Grid>
         
              <Grid item xs ={10}>
                <Box component="span" sx={{
                      display: 'block',
                      pt: 1,
                      pl: 2,
                      width: 800,
                      color:  'grey.800',
                      borderRadius: 2,
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }}>
                  {item['num_participants'] > 1 && <div>{item['num_participants']} people participated in this quiz.</div>}
                  {item['num_participants'] === 1 && <div>{item['num_participants']} person participated in this quiz.</div>}
                  {item['num_participants'] === 0 && <div>{'No one has participated in this quiz. Be the first one!'}</div>}
                  {item['pass_rate'] >= 0 &&<div>Pass rate: {item['pass_rate']} %</div>}
                </Box>  
              </Grid>
              {item['complete_status'] === 0 &&
                <Grid item xs ={10}>
                  <Box component="span" sx={{
                        display: 'block',
                        p: 1,
                        width: 800,
                        bgcolor: 'grey.100' ,
                        color:  'grey.800',
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: '600',
                      }}>
                    {item['description']}
                  </Box>  
                </Grid>}
            </Grid>

          )}
          </Grid>

 
    

      </Grid>

    </Box>
  );
};
export default Quiz;