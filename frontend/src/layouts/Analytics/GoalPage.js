import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';

const GoalPage = () => {
  const [goal, setGoal] = React.useState('');
  const [enableEditGoal, setEnableEditGoal] = React.useState(false);

  // api set goal fetch
  const submitGoal = () => {

  }

  const toggleEditGoal = () => {
    setEnableEditGoal(!enableEditGoal)
  }
  
  return (
    <div>
      <h2 style={{fontWeight: "normal"}}>Reading Goal</h2>
      <span>
        I want to read
          <FormControl disabled={!enableEditGoal} sx={{ m: 1, width: '25ch' }} variant="standard">
            <Input
              type="number"
              size="small"
              onChange={e => setGoal(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleEditGoal}
                  >
                    {enableEditGoal ? <CheckCircleIcon onClick={submitGoal}/> : <EditIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        books this month
      </span>
    </div>
  )
}

export default GoalPage;