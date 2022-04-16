import React, { useState, useRef, useEffect } from 'react';
import { url } from '../../components/Helper';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ErrorPopup from '../../components/ErrorPopup';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {Link, useParams} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

/**
 * Page to display all available quizzes
 */
const Allquiz = () => {
  const [allquiz,setAllquiz] = React.useState([]);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const navigate = useNavigate();
  let admintoken = localStorage.getItem('admin_token');
  const openQuiz = (id) => {
    axios.post(`${url}/quiz/openquiz`, {
      quiz_id: id,
      token: admintoken
    }).then(function (res) {
      axios.get(`${url}/quiz/getallquiz`, {params: {token:admintoken
      }})
      .then(function (res) {
        setAllquiz(res['data']['quizzes'])
      })
     
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.response.data.message));
      setSnackBarOpen(true);
    });

  }

  const closeQuiz = (id) => {
    axios.post(`${url}/quiz/closequiz`, {
      quiz_id: id,
      token: admintoken
    }).then(function (res) {
      axios.get(`${url}/quiz/getallquiz`, {params: {token:admintoken
      }})
      .then(function (res) {
        setAllquiz(res['data']['quizzes'])
      })
     
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.response.data.message));
      setSnackBarOpen(true);
    });
  }
  const deleteQuiz = (id) => {
    let payload = {
      quiz_id: id,
      token:admintoken
    }
    axios.delete(`${url}/quiz/deletequiz`, { data: payload }).then(function (res) {
      axios.get(`${url}/quiz/getallquiz`, {params: {token: admintoken
      }})
      .then(function (res) {
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
    axios.get(`${url}/quiz/getallquiz`, {params: {token:admintoken
    }})
    .then(function (res) {
      setAllquiz(res['data']['quizzes'])
    })
  }, []);
  const handleLogOut = () => {
    axios.post(`${url}/admin/logout`, {
      token: admintoken
    }).then(function (res) {
      localStorage.clear();
      navigate('/bookstation/login'); 
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.response.data.message));
      setSnackBarOpen(true);
    });


  }
    return (
      <Box m={2} pt={2}>


        <ErrorPopup errorMsg={errorMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen} />
        <Grid container direction='row' spacing={10} justifyContent='center' >

          <Grid item  xs={4}>
            <List >
            <Typography variant='h4' gutterBottom component='div'>
             Current quizzes
            </Typography>
            {allquiz.length > 0 &&  allquiz.map((item, i) =>   
            <ListItem
                key={item['id']}
              > 
              <IconButton edge='end' aria-label='delete' onClick={() => deleteQuiz(item['id'])}>
                <DeleteIcon sx={{ fontSize: 30 }}/>
              </IconButton>
              {item['status'] == 0 &&
                <IconButton edge='end' onClick={() => openQuiz(item['id'])}>
                  <ToggleOffIcon  sx={{ fontSize: 30 }}/>
                </IconButton>
              }

              {item['status'] == 1 &&
                <IconButton edge='end' onClick={() => closeQuiz(item['id'])}>
                  <ToggleOnIcon color='primary' sx={{ fontSize: 30 }}/>
                </IconButton>
              }   

              <ListItemText sx={{ paddingLeft: 2 }} 
                primary={item['quiz_name']}
              />
              {item['status'] === 0 &&
                <Button variant='outlined' component = {Link} to={`/bookstation/editquiz/?id=${item['id']}`}>
                  Edit
                </Button>              
              }


            </ListItem>)}

            </List>  
          </Grid>   
          <Grid item  xs={3}>
            <Grid container direction='column' spacing={3}>    
              <Grid item  xs={2}>
                <Button onClick={handleLogOut} variant='contained' sx={{ marginTop: 1, fontSize:15}}>
                Log Out
                </Button>
              </Grid> 
              <Grid item  xs={3}>
                <Button edge='start' color='primary' variant='outlined' sx={{ marginTop: 5, paddingRight: 3 }} onClick={handleCreateQuiz}>
                  <AddCircleIcon sx={{ paddingRight: 2 }} />
                  Create Quiz
                </Button>   
              </Grid> 
            </Grid>

          </Grid>    

        </Grid>

      </Box>
    );
  };
export default Allquiz;