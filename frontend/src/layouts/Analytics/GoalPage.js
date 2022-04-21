import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import axios from 'axios';
import ErrorPopup from '../../components/ErrorPopup';
import SuccessPopup from '../../components/SuccessPopup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {url} from '../../components/Helper';
import GoalHistoryGraph from './GoalHistoryGraph';
import Box from '@mui/material/Box';

/**
 * Goal page includes input form for setting reading goal for current month
 * and shows statistics for monthly and yearly goal progress
 * @returns analytics goal page information
 */
const GoalPage = () => {
  const [goal, setGoal] = React.useState(0);
  const [goalSubmit, setGoalSubmit] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');
  const [enableEditGoal, setEnableEditGoal] = React.useState(false);
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);

  // fetch user's goal information on refresh
  React.useEffect(() => {
    getGoal();
  }, []);

  // calculate days until end of month
  const date = new Date();
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
  const daysUntilEndOfMonth = lastDayOfMonth - date.getDate();
  let daySuffix = '';
  if (daysUntilEndOfMonth !== 1) daySuffix = 's';

  // get goal that user set
  const getGoal = () => {
    axios.get(`${url}/user/checkgoal`, {params: {
        token: localStorage.getItem('token')
      }}).then(function (response) {
      if (response['data']['goal'] === -1) {
        setGoal(0);
      } else {
        setGoal(response['data']['goal']);
        setGoalSubmit(response['data']['goal']);
      }
      setCompleted(response['data']['finished']);
    }).catch(function (error) {
      // show error message if goal cannot be retrieved
      setSuccessMsg('');
      setErrorMsg(JSON.stringify(error.message));
      setSnackBarOpen(true);
    });
  }

  // set new reading goal
  const submitGoal = (e) => {
    if (e) e.preventDefault();
    if (goal < 0) {
      setSnackBarOpen(true);
      getGoal();
      return;
    }
    axios.post('http://localhost:8080/user/setgoal', {
      token: localStorage.getItem('token'),
      goal: goal
    }).then(function (response) {
      setGoalSubmit(goal);
      setGoal(goal);
      setErrorMsg('');
      setSuccessMsg('Reading goal is updated');
      setSnackBarOpen(true);

    }).catch(function (error) {
      // show error if goal cannot be updated
      setSuccessMsg('');
      setErrorMsg(JSON.stringify(error.response.data.message));
      setSnackBarOpen(true);
    });
  }

  const toggleEditGoal = () => {
    setEnableEditGoal(!enableEditGoal)
  }

  const goalStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '40px',
    marginBottom: '50px'
  }

  // card showing books read and books remaining for current month
  const ProgressCard = () => {
    return (
      <Card sx={{ minWidth: 200 }} style={{backgroundColor: '#b5943f', marginTop: '-30px'}} >
        <CardContent style={{color: 'white'}}>
          <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <div>
              <span>Completed</span>
              <Card sx={{ minWidth: 50 }} style={{backgroundColor: 'white', marginTop: '10px'}} >
                <CardContent style={{padding: '10px', textAlign: 'center'}}>{completed}</CardContent>
              </Card>
            </div>
            <div>
              <span>Remaining</span>
              <Card sx={{ minWidth: 50 }} style={{backgroundColor: 'white', marginTop: '10px'}} >
                <CardContent style={{padding: '10px', textAlign: 'center'}}>{(goalSubmit-completed) < 0 ? 0 : (goalSubmit-completed)}</CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // card showing days left in the month
  const TimeCard = () => {
    return (
      <Card sx={{ minWidth: 200 }} style={{backgroundColor: '#b5593f', marginTop: '-30px'}} >
        <CardContent style={{color: 'white', textAlign: 'center'}}>
          <span>Time Left</span>
          <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-evenly', paddingTop: '10px'}}>
            <Card sx={{ minWidth: 75 }} style={{backgroundColor: 'white'}} >
              <CardContent style={{padding: '10px'}}>{daysUntilEndOfMonth}</CardContent>
            </Card>
            <span style={{paddingTop: '10px'}}>day{daySuffix}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen}/>
      <SuccessPopup successMsg={successMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen}/>
      <h2 style={{fontWeight: 'normal'}}>Reading Goal</h2>
      <div style={goalStyle}>
        <span>
          <Box component='form' onSubmit={(e) => {submitGoal(e); toggleEditGoal()}}>
            <span>I want to read</span>
            <FormControl disabled={!enableEditGoal} sx={{ m: 2, width: '4ch' }} variant='standard' style={{marginTop: '5px', marginLeft:'5px', marginRight:'3px'}}>
              <Input
                type='number'
                size='small'
                value={goal}
                onChange={e => setGoal(e.target.value)}
              />
            </FormControl>
            <span>books in {date.toLocaleString('en-us', { month: 'long' })} {date.getFullYear()}&nbsp;
            </span>
            <IconButton
              aria-label='toggle password visibility'
              onClick={toggleEditGoal}
            >
              {enableEditGoal ? <CheckCircleIcon type='submit' onClick={(e) => submitGoal(e)}/> : <EditIcon />}
            </IconButton>
          </Box>
        </span>
        <ProgressCard/>
        <TimeCard/>
      </div>
      <div style={{paddingLeft: '20px', paddingRight: '20px'}} >
        <GoalHistoryGraph setSuccesMsg={setSuccessMsg} setErrorMsg={setErrorMsg} setSnackBarOpen={setSnackBarOpen} />
      </div>
    </div>
  )
}

export default GoalPage;