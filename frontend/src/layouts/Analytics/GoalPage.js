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
import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  Legend,
  Margin,
  Title,
  Subtitle,
  Tooltip,
  Grid,
} from 'devextreme-react/chart';

const GoalPage = () => {
  const [goal, setGoal] = React.useState(0);
  const [goalSubmit, setGoalSubmit] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');
  const [enableEditGoal, setEnableEditGoal] = React.useState(false);
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [allGoal, setAllGoal] = React.useState([]);
  React.useEffect(() => {
    getGoal();
    getAllGoal();
  }, []);

  const date = new Date();
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
  const daysUntilEndOfMonth = lastDayOfMonth - date.getDate();
  let daySuffix = '';
  if (daysUntilEndOfMonth !== 1) daySuffix = 's';

  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  const getAllGoal = () => {
    axios.get(`${url}/user/getallgoal`, {params: {
        token: localStorage.getItem('token')
      }}).then(function (response) {
        const temp = response['data']['goal_history'];
        const now = new Date()
        for (let i = 0; i < temp.length; i++) {
          const historyDate = new Date(temp[i]['created_time']);
          // remove current month's data
          if (historyDate.getFullYear() === now.getFullYear() && historyDate.getMonth() === now.getMonth()){
            temp.splice(i, 1);
          }
          // remove anything over 12 months
          if (monthDiff(historyDate, now) > 12) {
            temp.splice(i, 1);
          }
        }
        setAllGoal(temp);
        console.log(response['data']['goal_history']);
    }).catch(function (error) {
      // show error message if goal cannot be retrieved
      setSuccessMsg('');
      setErrorMsg(JSON.stringify(error.message));
      setSnackBarOpen(true);
    });
  }

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
  const submitGoal = () => {
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
    display: "flex",
    flexDirection: "row",
    gap: "40px",
    marginBottom: "50px"
  }

  const GoalLine = () => {
    return (
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
    )
  }

  const ProgressCard = () => {
    return (
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
                <CardContent style={{padding: "10px", textAlign: "center"}}>{(goalSubmit-completed) < 0 ? 0 : (goalSubmit-completed)}</CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const TimeCard = () => {
    return (
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
    )
  }

  const GoalGraph = () => {
    const statSources = [{value:'goal', name: 'Goal'}, {value:'books_completed', name: 'Books Completed'}];
    return (
      <Chart
        dataSource={allGoal}
        palette="Harmony Light"
      >
        <CommonSeriesSettings
          argumentField="created_time"
          type="line"
        />
        {
          statSources.map((item) => <Series
            key={item.value}
            valueField={item.value}
            name={item.name} />)
        }
        <Margin bottom={20} />
        <ArgumentAxis
          valueMarginsEnabled={false}
          discreteAxisDivisionMode="crossLabels"
        >
          <Grid visible={true} />
        </ArgumentAxis>
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
          itemTextPosition="bottom"
        />
        <Title text="Goals and Reading History">
          <Subtitle text="(within the last year)" />
        </Title>
        <Tooltip enabled={true} />
      </Chart>
    )
  }

  return (
    <div>
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen}/>
      <SuccessPopup successMsg={successMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen}/>
      <h2 style={{fontWeight: "normal"}}>Reading Goal</h2>
      <div style={goalStyle}>
        <GoalLine/>
        <ProgressCard/>
        <TimeCard/>
      </div>
      <div style={{paddingLeft: "20px", paddingRight: "20px"}} >
        <GoalGraph/>
      </div>
    </div>
  )
}

export default GoalPage;