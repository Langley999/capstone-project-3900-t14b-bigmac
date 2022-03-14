import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import axios from 'axios';
import ErrorPopup from '../../components/ErrorPopup';
import SuccessPopup from '../../components/SuccessPopup';
import {url} from '../../components/Helper'

const GoalPage = ({ display, userInfo }) => {
  const [goal, setGoal] = React.useState(0);
  const [goalLast, setGoalLast] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');
  const [enableEditGoal, setEnableEditGoal] = React.useState(false);

  React.useEffect(() => {
    getGoal();
  }, []);

  if (display !== 'goals') return null;

  const date = new Date();
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
  const daysUntilEndOfMonth = lastDayOfMonth - date.getDate();
  let daySuffix = '';
  if (daysUntilEndOfMonth > 1) daySuffix = 's';

  // get goal that user set
  const getGoal = () => {
    axios.get(`${url}/user/checkgoal`, {params: {
      operator: userInfo.email,
      token: localStorage.getItem('token')
    }}).then(function (response) {
      setErrorMsg('');
      if (response['data']['goal'] === -1) {
        setGoal(0);
      } else {
        setGoal(response['data']['goal']);
      }
      setCompleted(response['data']['finished']);
    }).catch(function (error) {
      // show server error message for 5 secs
      setErrorMsg(JSON.stringify(error.message));
      setTimeout(() => {setErrorMsg('')}, 5000);
    });
  }

  // set new reading goal
  const submitGoal = () => {
    axios.post(`${url}/user/setgoal`, {
      email: userInfo.email,
      token: localStorage.getItem('token'),
      goal: goal
    }).then(function (response) {
      setGoalLast(goal);
      setGoal(goal);
      setErrorMsg('');
      setSuccessMsg('Reading goal has been updated');
      console.log('success');
      setTimeout(() => {setSuccessMsg('')}, 5000);

    }).catch(function (error) {
      // show server error message for 5 secs
      console.log(error)
      setErrorMsg(JSON.stringify(error.response.data.message));
      setTimeout(() => {setErrorMsg('')}, 5000);
    });
  }

  const toggleEditGoal = () => {
    setEnableEditGoal(!enableEditGoal)
  }

  return (
    <div>
      <ErrorPopup errorMsg={errorMsg}/>
      <SuccessPopup successMsg={successMsg}/>
      <h2 style={{fontWeight: "normal"}}>Reading Goal</h2>
      <span>
        I want to read
          <FormControl disabled={!enableEditGoal} sx={{ m: 1, width: '4ch' }} variant="standard" style={{marginTop: '5px'}}>
            <Input
              type="number"
              size="small"
              value={goal}
              onChange={e => setGoal(e.target.value)}
            />
          </FormControl>
        books in {date.toLocaleString('en-us', { month: 'long' })} {date.getFullYear()}&nbsp;
        <IconButton
          aria-label="toggle password visibility"
          onClick={toggleEditGoal}
        >
          {enableEditGoal ? <CheckCircleIcon onClick={submitGoal}/> : <EditIcon />}
        </IconButton>
      </span>
      <br/>
      <span>You have completed {completed} books so far and there are {goal-completed} books to go</span>
      <br/>
      <br/>
      <span>You have {daysUntilEndOfMonth} day{daySuffix} left</span>
    </div>
  )
}

export default GoalPage;