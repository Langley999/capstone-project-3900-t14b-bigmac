import React from 'react';
import {url} from '../../components/Helper';
import axios from 'axios';
import ErrorPopup from '../../components/ErrorPopup';
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
import { useLocation } from 'react-router-dom';

const FriendPage = ({userInfo}) => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [stats, setStats] = React.useState([]);
  const [saves, setSaves] = React.useState(0);
  const location = useLocation();
  const [id, setId] = React.useState(parseInt(location.pathname.split('/')[2]));

  const months = [ "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December" ];

  React.useEffect(() =>{
    getFollowStats();
    getSaves();
    setId(parseInt(location.pathname.split('/')[2]));
  }, [location]);

  const getFollowStats = () => {
    axios.get(`${url}/analytics/followstats`, {params: {
      token: localStorage.getItem('token'),
      user_id: id
    }}).then(function (response) {
      const temp = response['data']['follow_stats'];
      for (let i = 0; i < 6; i++) {
        temp[i]['month'] = months[temp[i]['month']-1];
      }
      setStats(temp);
      console.log(temp);
      console.log(id);
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.message));
      setSnackBarOpen(true);
    })
  }

  const getSaves = () => {
    axios.get(`${url}/analytics/saves`, {params: {
      token: localStorage.getItem('token')
    }}).then(function (response) {
      setSaves(response['data']['saves']);
      console.log(response['data']['saves']);
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.message));
      setSnackBarOpen(true);
    })
  }

  const FollowGraph = () => {
    const statSources = [{value:'followers', name: 'Followers'}, {value:'followings', name: 'Followings'}];
    return (
      <Chart
        dataSource={stats}
        palette="Harmony Light"
        resolveLabelOverlapping="stack"
      >
        <CommonSeriesSettings
          argumentField="month"
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
        <Title text="Follow fluctuations in the last 6 months">
          <Subtitle text="(followers and followings)" />
        </Title>
        <Tooltip enabled={true} />
      </Chart>
    )
  }

  return (
    <div>
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen}/>
      <h2 style={{fontWeight: "normal"}}>Friend Activity</h2>
      <div style={{textAlign: "center", fontSize: 22, margin: "50px"}}>📚 {saves} user{saves !== 1 ? <>s</>: <></>} ha{saves !== 1 ? <>ve</>: <>s</>} saved {userInfo.user_id === id ? <>your</>: <>their</>} collections! 📚</div>
      <div style={{paddingLeft: "20px", paddingRight: "20px"}} >
        <FollowGraph/>
      </div>
    </div>
  )
}

export default FriendPage;