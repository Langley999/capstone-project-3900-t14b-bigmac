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
  if (daysUntilEndOfMonth !== 1) daySuffix = 's';

  // get goal that user set
  const getGoal = () => {
    axios.get(`${url}/user/checkgoal`, {params: {
        operator: userInfo.email,
        token: localStorage.getItem('token')
      }}).then(function (response) {
      if (response['data']['goal'] === -1) {
        setGoal(0);
      } else {
        setGoal(response['data']['goal']);
        setGoalLast(response['data']['goal']);
      }
      setCompleted(response['data']['finished']);
    }).catch(function (error) {
      // show server error message for 5 secs
      setErrorMsg(JSON.stringify(error.message));
      setTimeout(() => {setErrorMsg('')}, 1000);
    });
  }

  // set new reading goal
  const submitGoal = () => {
    if (goal < 0) {
      setSuccessMsg('');
      setErrorMsg('Goal cannot be set to a negative number');
      setTimeout(() => {setErrorMsg('')}, 1000);
      getGoal();
      return;
    }
    axios.post('http://localhost:8080/user/setgoal', {
      email: userInfo.email,
      token: localStorage.getItem('token'),
      goal: goal
    }).then(function (response) {
      setGoalLast(goal);
      setGoal(goal);
      setErrorMsg('');
      setSuccessMsg('Reading goal has been updated');
      console.log('success');
      setTimeout(() => {setSuccessMsg('')}, 1000);

    }).catch(function (error) {
      // show server error message for 5 secs
      setErrorMsg(JSON.stringify(error.message));
      setTimeout(() => {setErrorMsg('')}, 1000);
    });
  }

  const toggleEditGoal = () => {
    setEnableEditGoal(!enableEditGoal)
  }

  const goalStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "40px"
  }

  return (
    <div>
      <ErrorPopup errorMsg={errorMsg}/>
      <SuccessPopup successMsg={successMsg}/>
      <h2 style={{fontWeight: "normal"}}>Reading Goal</h2>
      <div style={goalStyle}>
        <div>
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
        </div>
        <Card sx={{ minWidth: 200 }} style={{backgroundColor: "#b5943f", marginTop: "-30px"}} >
          <CardContent style={{color: "white"}}>
            <div style={{display: "flex", flexDirection:"row", justifyContent:"space-between"}}>
              <div>
                <span>Completed</span>
                <Card sx={{ minWidth: 50 }} style={{backgroundColor: "white", marginTop: "10px"}} >
                  <CardContent style={{padding: "10px", textAlign: "center"}}>{completed}</CardContent>
                </Card>
              </div>
              <div>
                <span>Remaining</span>
                <Card sx={{ minWidth: 50 }} style={{backgroundColor: "white", marginTop: "10px"}} >
                  <CardContent style={{padding: "10px", textAlign: "center"}}>{(goalLast-completed) < 0 ? 0 : (goalLast-completed)}</CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }} style={{backgroundColor: "#b5593f", marginTop: "-30px"}} >
          <CardContent style={{color: "white", textAlign: "center"}}>
            <span>Time Left</span>
            <div style={{display: "flex", flexDirection:"row", justifyContent:"space-evenly", paddingTop: "10px"}}>
              <Card sx={{ minWidth: 75 }} style={{backgroundColor: "white"}} >
                <CardContent style={{padding: "10px"}}>{daysUntilEndOfMonth}</CardContent>
              </Card>
              <span style={{paddingTop: "10px"}}>day{daySuffix}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default GoalPage;