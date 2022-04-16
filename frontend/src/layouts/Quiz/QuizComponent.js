import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';

/**
 * Component to allow adding new question for a quiz
 */
const QuizComponent = ({id, question,ans, components, setComponents}) => { 
  const key = id;
  const [check1,setcheck1] = React.useState(components[key]['ans'][0]['is_correct']);
  const [check2,setcheck2] = React.useState(components[key]['ans'][1]['is_correct']);
  const [check3,setcheck3] = React.useState(components[key]['ans'][2]['is_correct']);
  const [check4,setcheck4] = React.useState(components[key]['ans'][3]['is_correct']);
  const handleChangeAnswer = (content,i)=> {
    let componentsCopy = [...components];
    componentsCopy[id]['ans'][i]['content'] = content;
    setComponents(componentsCopy);
  }
  const handleChangeQuestion = (content)=> {
    let componentsCopy = [...components];
    componentsCopy[id]['question'] = content;
    setComponents(componentsCopy);
  }
  const handleChangeCorrect = (flag,i)=> {
    let componentsCopy = [...components];
    componentsCopy[id]['ans'][i]['is_correct'] = flag;
    setComponents(componentsCopy); 
  }

  useEffect(() => {
    setcheck1(components[key]['ans'][0]['is_correct']);
    setcheck2(components[key]['ans'][1]['is_correct']);
    setcheck3(components[key]['ans'][2]['is_correct']);
    setcheck4(components[key]['ans'][3]['is_correct']);
  }, [window.location.href, components]);
  
  return ( 
    
    <div className="Component"> 
      <TextField id="standard-basic" label="Question" variant="standard" sx={{ marginBottom: 3 }} style = {{width: 760}} value={components[key]['question']} onChange={(event) => handleChangeQuestion(event.target.value)}/>
      <Grid container direction="row" spacing={2} justifyContent="center"  sx={{ marginBottom: 3 }}>
        <Grid item xs={7}>
          <TextField id="standard-basic" label="Answer 1" variant="standard" value={components[key]['ans'][0]['content'] } style = {{width: 550}} onChange={(event) => handleChangeAnswer(event.target.value,0)}/>
        </Grid>
        <Grid item xs={1}>
          <Checkbox size="small" checked={check1} onChange={(event) => handleChangeCorrect(event.target.checked,0)}/>
        </Grid>
        <Grid item xs={7}>
          <TextField id="standard-basic" label="Answer 2" variant="standard" value={components[key]['ans'][1]['content'] } style = {{width: 550}} onChange={(event) => handleChangeAnswer(event.target.value,1)}/>
        </Grid>
        <Grid item xs={1}>
          <Checkbox size="small" checked={check2}  onChange={(event) => handleChangeCorrect(event.target.checked,1)}/>
        </Grid>
        <Grid item xs={7}>
          <TextField id="standard-basic" label="Answer 3" variant="standard" value={components[key]['ans'][2]['content'] } style = {{width: 550}} onChange={(event) => handleChangeAnswer(event.target.value,2)}/>
        </Grid>
        <Grid item xs={1}>
          <Checkbox size="small" checked={check3} onChange={(event) => handleChangeCorrect(event.target.checked,2)}/>
        </Grid>
        <Grid item xs={7}>
          <TextField id="standard-basic" label="Answer 4" variant="standard" value={components[key]['ans'][3]['content'] } style = {{width: 550}} onChange={(event) => handleChangeAnswer(event.target.value,3)}/>
        </Grid>
        <Grid item xs={1}>
          <Checkbox size="small" checked={check4}  onChange={(event) => handleChangeCorrect(event.target.checked,3)}/>
        </Grid>
      </Grid>
    </div> 
    
  ); 
  
}; 

export {QuizComponent};