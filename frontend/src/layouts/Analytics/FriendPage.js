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
  CommonAxisSettings,
} from 'devextreme-react/chart';
import { useLocation } from 'react-router-dom';

const FriendPage = ({userInfo}) => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [stats, setStats] = React.useState([]);
  const [saves, setSaves] = React.useState([]);
  const location = useLocation();
  const [id, setId] = React.useState(parseInt(location.pathname.split('/')[2]));
  const months = [ "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December" ];
  const [totalSaves, setTotalSaves] = React.useState(0);
  const [collections, setCollections] = React.useState([]);

  React.useEffect(() =>{
    getFollowStats();
    getCollections();
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
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.message));
      setSnackBarOpen(true);
    })
  }

  const getCollections = () => {
    axios.get(`${url}/collection/getall`, {params: {
      user_id: id
    }}). then (function (response) {
      setCollections(response['data']['collections']);
      const collectionsList = response['data']['collections'];
      let temp = []
      let sum = 0
      for (let collection of collectionsList) {
        axios.get(`${url}/analytics/saves`, {params: {
          token: localStorage.getItem('token'),
          collection_id: collection.id
        }}).then(function (response) {
          sum += response['data']['saves']
          temp.push({name: collection.name, saves: response['data']['saves']});
          setTimeout(() => {
            setTotalSaves(sum);
            setSaves(temp);
          }, 200);
        }).catch(function (error) {
          setErrorMsg(JSON.stringify(error.message));
          setSnackBarOpen(true);
        })
      }
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.message));
      setSnackBarOpen(true);
    })
  }

  const CollectionsGraph = () => {
    return (
      <Chart id="chart" dataSource={saves} resolveLabelOverlapping="stack">
        <Series
          valueField="saves"
          argumentField="name"
          name="Saves"
          type="bar"
          color="#ad79cd" />
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
          itemTextPosition="bottom"
        />
        <CommonAxisSettings
          allowDecimals={false}
          discreteAxisDivisionMode="betweenLabels"
        />
        <Title text={`Number of saves ${userInfo.user_id === id ? "your": "their"} collections have`}/>
      </Chart>
    )
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
      <div style={{textAlign: "center", fontSize: 22, margin: "50px"}}>📚 {userInfo.user_id === id ? <>Your</>: <>Their</>} collections ha{totalSaves !== 1 ? <>ve</>: <>s</>} been saved {totalSaves} times by other users ! 📚</div>
      <div style={{paddingLeft: "20px", paddingRight: "20px"}} >
        <CollectionsGraph style={{marginBottom: "50px"}}/>
        <FollowGraph/>
      </div>
    </div>
  )
}

export default FriendPage;