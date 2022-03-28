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
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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

const Allquiz = () => {
  const [allquiz,setAllquiz] = React.useState([]);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const navigate = useNavigate();
  const openQuiz = (id) => {
    console.log('open')
    console.log(id)
    axios.post(`${url}/quiz/openquiz`, {
      quiz_id: id
    }).then(function (res) {
      axios.get(`${url}/quiz/getallquiz`, {params: {
      }})
      .then(function (res) {
        console.log(res['data']['quizzes'])
        setAllquiz(res['data']['quizzes'])
      })
     
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.response.data.message));
      setSnackBarOpen(true);
    });

  }

  const closeQuiz = (id) => {
    console.log('close')
    console.log(id)
    axios.post(`${url}/quiz/closequiz`, {
      quiz_id: id
    }).then(function (res) {
      axios.get(`${url}/quiz/getallquiz`, {params: {
      }})
      .then(function (res) {
        console.log(res['data']['quizzes'])
        setAllquiz(res['data']['quizzes'])
      })
     
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.response.data.message));
      setSnackBarOpen(true);
    });
  }
  const deleteQuiz = (id) => {
    let payload = {
      quiz_id: id
    }
    axios.delete(`${url}/quiz/deletequiz`, { data: payload }).then(function (res) {
      axios.get(`${url}/quiz/getallquiz`, {params: {
      }})
      .then(function (res) {
        console.log(res['data']['quizzes'])
        setAllquiz(res['data']['quizzes'])
      })
     
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.response.data.message));
      setSnackBarOpen(true);
    });
  }

  const handleCreateQuiz = () => {
    navigate('/bookstation/makequiz');
  }
  useEffect(() => {
    axios.get(`${url}/quiz/getallquiz`, {params: {
    }})
    .then(function (res) {
      console.log(res['data']['quizzes'])
      setAllquiz(res['data']['quizzes'])
    })
  }, []);


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
              <IconButton edge="end" aria-label="delete" onClick={() => deleteQuiz(item['id'])}>
                <DeleteIcon sx={{ fontSize: 30 }}/>
              </IconButton>
              {item['status'] == 0 &&
                <IconButton edge="end" onClick={() => openQuiz(item['id'])}>
                  <ToggleOffIcon  sx={{ fontSize: 30 }}/>
                </IconButton>
              }

              {item['status'] == 1 &&
                <IconButton edge="end" onClick={() => closeQuiz(item['id'])}>
                  <ToggleOnIcon color="primary" sx={{ fontSize: 30 }}/>
                </IconButton>
              }   

              <ListItemText sx={{ paddingLeft: 2 }}
                primary={item['quiz_name']}
              />

            </ListItem>)}

            </List>  
          </Grid>   
          <Grid item  xs={3}>
            <IconButton edge="start" color="primary" sx={{ marginTop: 10, paddingRight: 3 }} onClick={handleCreateQuiz}>
              <AddCircleIcon sx={{ paddingRight: 2 }} />
              Create Quiz
            </IconButton>
          </Grid>     
        </Grid>

      </Box>
    );
  };
export default Allquiz;