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
import { QuizComponent } from './QuizComponent.js'; 
import { TryRounded } from '@mui/icons-material';

const Addquiz = () => {

  const [quizname,setquizname] = React.useState('');
  const [components, setComponents] = useState([{
    question:"",
    ans:[{"content":"", "is_correct":false},{"content":"", "is_correct":false},{"content":"", "is_correct":false},{"content":"", "is_correct":false}]
  }]); 
  
  const [errorMsg, setErrorMsg] = React.useState('');
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const navigate = useNavigate();
 
  let admintoken = localStorage.getItem('admin_token');
  useEffect(() => {
    axios.get(`${url}/quiz/getallquiz`, {params: {token:admintoken
    }})
    .then(function (res) {

    })
  }, []);
  const handleSubmitQuiz = () => {
    let canSubmit = true;
    if (quizname === "") {
      setErrorMsg("Please enter quiz name");
      setSnackBarOpen(true);
      canSubmit = false;
    } else {
      for(let i = 0; i < components.length; i++){
        if (components[i]['question'] === "") {
          setErrorMsg("Please complete your input for question");
          setSnackBarOpen(true);
          canSubmit = false;
          break;
        } else {
          let flag = 0;
          let answernull = 0;
          for(let j = 0; j < 4; j++){
            if (components[i]['ans'][j]['content'] === "") {
              answernull ++;
            }
            if (components[i]['ans'][j]['is_correct'] === true) {
              flag++;
            }
          
          }
          if (answernull > 0) {
            setErrorMsg("Please complete your input for answer");
            setSnackBarOpen(true);
            canSubmit = false;
            break;
          }
          if (flag !== 1) {
            setErrorMsg("Please choose one correct answer per question");
            setSnackBarOpen(true);
            canSubmit = false;
            break;
          }
        }
      }
    }


    if (canSubmit) {

      let id = localStorage.getItem('admin_id');
      console.log(id);
      let body = {
        id: id,
        name: quizname,
        questions: components,
        token: admintoken
      }
      axios.post(`${url}/quiz/createquiz`, 
        body
      ).then(function (res) {
        setquizname("");
        setComponents([{
          question:"",
          ans:[{"content":"", "is_correct":false},{"content":"", "is_correct":false},{"content":"", "is_correct":false},{"content":"", "is_correct":false}]
        }]);
        navigate('/bookstation/allquiz');
      }).catch(function (error) {
        setErrorMsg(JSON.stringify(error.response.data.message));
        setSnackBarOpen(true);
      });
    }

  }

  function addComponent() {  
    setComponents([...components, {
      question:"",
      ans:[{"content":"", "is_correct":false},{"content":"", "is_correct":false},{"content":"", "is_correct":false},{"content":"", "is_correct":false}]
    }])  
  } 

  const handleBack = () => {
    navigate('/bookstation/allquiz');
  }

  const handleRemoveComponent = (event,key) => {
    let componentscopy = [];
    for (let i = 0; i < components.length;i++) {
      if (i !== key) {
        componentscopy.push(components[i]);
      }
    }
    setComponents(componentscopy);
  }
    return (
      <Box mx={30} pt={0} >
            <Button onClick={handleBack} variant="contained" sx={{ marginTop: 10, fontSize:15}}>
              Back
            </Button>  
        <ErrorPopup errorMsg={errorMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen} />
        <Grid container direction="column" spacing={5} justifyContent="center" alignContent="center" alignItems="center">  
          <Grid item  xs={2}>
             
          </Grid>
          <Grid item  xs={10}>
            <Typography variant="h4" gutterBottom component="div">
             Create Quiz 
            </Typography>
            <Typography variant="body2" gutterBottom component="div">
             (Please choose only 1 correct answer per question)
            </Typography>
            <TextField id="standard-basic" label="Quiz Name" variant="outlined" sx={{ marginBottom: 3 }} style = {{width: 760}} value={quizname} onChange={(event) => setquizname(event.target.value)}/>

            {components.map((item, i) => ( <div>
              <QuizComponent id={i} question={item['question']} ans={item['ans']} components={components} setComponents={setComponents}/> <Button onClick={(event) =>handleRemoveComponent(event,i)}>Remove</Button> </div>)
            )} 
            <IconButton edge="start" color="primary" sx={{ marginTop: 10, paddingRight: 3, fontSize:20}} onClick={addComponent}>
              <AddCircleIcon sx={{ paddingRight: 2 }} />
              Add Question
            </IconButton>

          </Grid> 
          <Grid item  xs={2}>
            <Button onClick={handleSubmitQuiz} variant="contained" sx={{ marginTop: 10, fontSize:15}}>
              Submit
            </Button>               
          </Grid>
 
        </Grid>

      </Box>
    );
};
export default Addquiz;