import React from 'react';
import {url} from '../../components/Helper';
import axios from 'axios';
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

// graph showing reading goal history in last 12 months
const GoalHistoryGraph = ({setSuccessMsg, setErrorMsg, setSnackBarOpen}) => {
  const [allGoal, setAllGoal] = React.useState([]);

  const statSources = [{value:'goal', name: 'Goal'}, {value:'books_completed', name: 'Books Completed'}];

  React.useEffect(() => {
    getAllGoal();
  }, []);

  // get goal history of last 12 months, not including current month
  const getAllGoal = () => {
    axios.get(`${url}/user/getallgoal`, {params: {
        token: localStorage.getItem('token')
      }}).then(function (response) {
        let temp = response['data']['goal_history'];
        const now = new Date();
        for (let currTemp of temp) {
          const historyDate = new Date(currTemp['created_time']);
          currTemp['created_time'] = historyDate.toLocaleString('en-us', {month: 'long'}) + ' ' + historyDate.getFullYear().toString();
          
        }
        temp.reverse()
        temp = temp.slice(-14, -1)
        setAllGoal(temp);
       
    }).catch(function (error) {
      // show error message if goal cannot be retrieved
      setSuccessMsg('');
      setErrorMsg(JSON.stringify(error.message));
      setSnackBarOpen(true);
    });
  }
  return (
    <>
    {allGoal.length > 0 ?
    <Chart
      dataSource={allGoal}
      palette='Harmony Light'
      resolveLabelOverlapping='stack'
    >
      <CommonSeriesSettings
        argumentField='created_time'
        type='line'
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
        discreteAxisDivisionMode='crossLabels'
      >
        <Grid visible={true} />
      </ArgumentAxis>
      <Legend
        verticalAlignment='bottom'
        horizontalAlignment='center'
        itemTextPosition='bottom'
      />
      <Title text='Goals and Reading History'>
        <Subtitle text='(within the last year)' />
      </Title>
      <Tooltip enabled={true} />
    </Chart> :
    <div>You don't have past reading goal history, check again next month</div>}
    </>
  )
}

export default GoalHistoryGraph;