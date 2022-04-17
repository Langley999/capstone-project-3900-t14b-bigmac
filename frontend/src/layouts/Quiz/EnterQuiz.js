import React, { useState, useEffect } from 'react';
import { url } from '../../components/Helper';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ErrorPopup from '../../components/ErrorPopup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * Component to participate a quiz
 */
const EnterQuiz = () => {
  const [allquestions,setAllquestions] = React.useState([]);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [curr_question, setCur_question] = React.useState(0);
  const [selection, setSelection] = React.useState();
  const [page, setPage] = React.useState(1);
  const [ans, setans] = useState({ });
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [context, setContext] = React.useState('');
  const [mark, setMark] = React.useState(0);
  const navigate = useNavigate();

  const updateSelection = (event, value) => {
    
    event.persist();
    setSelection(value);
    setans(prevState => ({
      ...prevState,
      [curr_question]: value
    }));
  };

  const handleChange = (event, value) => {
    setPage(value);
    setCur_question(value-1);
    if (ans[value-1] !== undefined){
      setSelection(ans[value-1]);
    } else {
      setSelection(-1);
    }
    
  };
  const handlesubmit = () => {
    let quizid = Number(window.location.search.split('=')[1]);
    if (Object.keys(ans).length < allquestions.length) {
      setErrorMsg('Please complete all the questions!');
      setSnackBarOpen(true);
    } else {
      let anslist = {};
      for (let i = 0; i < allquestions.length; i++){
        anslist[allquestions[i].id] = ans[i];
      }
    
      axios.post(`${url}/quiz/submitanswer`, {
        quiz_id: quizid,
        ans: anslist,
        token: localStorage.getItem('token')
      }).then(res => {
        if (res['data']['status'] === 'PASS') {
          setTitle("Congrats! You've passes the quiz!");
          setMark(res['data']['result']);
          setContext('Please check the badge you just gained!');
        } else if (res['data']['status'] === 'FAIL' ) {
          setTitle("Oops! You didn't pass the quiz...");
          setMark(res['data']['result']);
          setContext('Try some other quizzes!');
        }
        setOpen(true);
      }).catch(error => {
        setErrorMsg(error.response.data.message);
        setSnackBarOpen(true);
      })
    }
  }
  const handleClose = () => {
    setOpen(false);
  };

  const handleReturn = () => {
    setOpen(false);
    navigate('/quiz');
  }

  useEffect(() => {
    const quiz_id = Number(window.location.search.split('=')[1]);
    axios.get(`${url}/quiz/getquiz`, {
      params: {
        token: localStorage.getItem('token'),
        quiz_id: quiz_id
      }
    })
    .then(function (response) {
      let data = response['data'];
      setAllquestions(data['questions']);
    }).catch(function (error) {
      setErrorMsg(error.response.data.message);
      setSnackBarOpen(true);
    });
  }, [window.location.href]);


  return (
    <Box m={2} pt={2}>
      {allquestions.length > 0&&
      <div>
        <Grid container direction='row' spacing={2} justifyContent='space-between' >
          <Grid item  xs={1}>
            <Button variant='outlined' sx={{ width:190 }}  onClick={handleReturn}>
                {'> Back To Quiz List'}
            </Button>   
          </Grid>
          <Grid item  xs={10}>
            <ErrorPopup errorMsg={errorMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen} />
            <Grid container direction='row' spacing={3} justifyContent='center' alignContent='center'>
              <Grid item  xs={10}>
                <Typography variant='body1' gutterBottom component='div'>
                 {'Question'} {page}
                </Typography>
                <Typography variant='h5' gutterBottom component='div'>
                  {allquestions[curr_question]['question']}
                </Typography>
              
                <FormLabel sx={{ marginTop:6 }} component='legend'>Please choose the right answer:</FormLabel>
                <RadioGroup name='value' value={selection?selection:-1} onChange={updateSelection}>
                  {allquestions[curr_question]['ans']
                    .map(datum => (
                      <FormControlLabel
                        label={datum.content}
                        key={datum.id}
                        value={datum.id}
                        
                        control={<Radio color='primary' />}
                      />
                    ))}
                </RadioGroup>
              </Grid> 
              <Grid item xs={6}>
                <Box m={2} pt={2}>
                  <Pagination count={allquestions.length} page={page} onChange={handleChange} />
                </Box>
              </Grid>
              <Grid item xs={7}>
                <Button sx={{ marginLeft: '25%' }} variant='contained' onClick={handlesubmit}>
                  Submit
                </Button>
              </Grid>
                           
               
            </Grid>
          </Grid>
        </Grid>
        <Dialog
          maxWidth={200}
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You got {mark}%.
            </DialogContentText>
            <DialogContentText>

              {context}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleReturn} >Return To Quiz List</Button>
          </DialogActions>
        </Dialog>

      </div>

      }
    </Box>
  );
};
export default EnterQuiz;