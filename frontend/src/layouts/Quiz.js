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
  let admintoken = localStorage.getItem('admin_token');


  const handleCreateQuiz = () => {
    navigate('/bookstation/makequiz');
  }


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
      <Grid container direction="row" spacing={10} justifyContent="center" >

        <Grid item  xs={4}>
          <List >
          <Typography variant="h4" gutterBottom component="div">
            Current quizzes
          </Typography>
          {allquiz.length > 0 &&  allquiz.map((item, i) =>   
          <ListItem
              key={item['id']}
            > 
            
            
            <Avatar src={item['badge_image']} />
            <ListItemText sx={{ paddingLeft: 2 }} 
              primary={item['quiz_name']}
            />
          
           {item['complete_status'] === 'NONE' &&
            <Button variant="outlined" component = {Link} to={`/enterquiz/?id=${item['id']}`}>
              Enter
            </Button>}          
            {item['complete_status'] === 'PASS' &&
            <Button variant="outlined" disabled>
              PASSED
            </Button>}    
            {item['complete_status'] === 'FAIL' &&
            <Button variant="outlined" disabled>
              COMPLETED 
            </Button>}       

          </ListItem>)}

          </List>  
        </Grid>    

      </Grid>

    </Box>
  );
};
export default Quiz;