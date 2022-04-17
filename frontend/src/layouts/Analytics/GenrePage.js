import React from 'react';
import Paper from '@mui/material/Paper';
import PieChart, {
  Legend,
  Series,
  Label,
  Font,
  Connector,
} from 'devextreme-react/pie-chart';
import Box from '@mui/material/Box';
import {url} from '../../components/Helper';
import axios from 'axios';
import ErrorPopup from '../../components/ErrorPopup';
import { useLocation } from 'react-router-dom';

/**
 * Genre page displaying proportions of top 5 genres and authors in the form of pie charts
 * @param {Object} userInfo information of the user currently logged in 
 * @returns analytics genre page information
 */
const GenrePage = ({userInfo}) => {
  const [genres, setGenres] = React.useState([]);
  const [authors, setAuthors] = React.useState([]);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const location = useLocation();
  const [id, setId] = React.useState(parseInt(location.pathname.split('/')[2]));

  // fetch data for top 5 authors and genres
  React.useEffect(() =>{
    getFavGenres();
    getFavAuthors();
    setId(parseInt(location.pathname.split('/')[2]));
  }, [location]);

  const getFavGenres = () => {
    axios.get(`${url}/analytics/getfavgenres`, {params: {
      user_id: id
    }}).then(function (response) {
      setGenres(response['data']['genres']);
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.message));
      setSnackBarOpen(true);
    })
  }

  const getFavAuthors = () => {
    axios.get(`${url}/analytics/getfavauthors`, {params: {
      user_id: id
    }}).then(function (response) {
      setAuthors(response['data']['authors']);
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.message));
      setSnackBarOpen(true);
    })
  }

  // returns a pie chart, given the necessary descriptions and data
  const CustomPieChart = ({title, value, argument, data, errorMsg, palette}) => {
    function customizeText(arg) {
      return `${arg.argument} (${arg.percentText})`;
    }
    return (
      <>
      {data.length >= 5 ? 
        <PieChart dataSource={data} palette={palette} resolveLabelOverlapping='shift' title={title}>/
        <Legend
          visible={false}
          orientation='horizontal'
          itemTextPosition='right'
          horizontalAlignment='center'
          verticalAlignment='bottom'
          columnCount={4}
        />
        <Series valueField={value} argumentField={argument}>
          <Label
            visible={true}
            position='columns'
            customizeText={customizeText}>
            <Font size={12} />
            <Connector visible={true} width={0.5} />
          </Label>
        </Series>
      </PieChart>
      : <div>{errorMsg}</div>}
      </>
    )
  }

  return (
    <div style={{paddingBottom: '325px'}}>
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen}/>
      <h2 style={{fontWeight: 'normal'}}>{userInfo.user_id === id ? <>Your</> : <>Their</>} Genres</h2>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <Box m={0} p={0} style={{width: '425px', height: '100px'}}>
          <Paper elevation={3} style={{padding: '10px'}} >
            <CustomPieChart title={`Top 5 Genres in ${userInfo.user_id === id ? 'Your' : 'Their'} Collections`} value='percentage' argument='genre' data={genres} errorMsg={userInfo.user_id === id ?'Add books to your collection to see proportion of genres':'Book genre information is not available'} palette='Bright'/>
          </Paper>
        </Box>
        <Box m={0} p={0} style={{width: '425px', height: '100px'}}>
          <Paper elevation={3} style={{padding: '10px'}} >
            <CustomPieChart title={`Top 5 Authors in ${userInfo.user_id === id ? 'Your' : 'Their'} Collections`} value='percentage' argument='author' data={authors}  errorMsg={userInfo.user_id === id ?'Add books to your collection to see proportion of authors':'Author information is not available'} palette='Dark Violet'/>
          </Paper>
        </Box>
      </div>
      <span>&nbsp;</span>
    </div>
  )
}

export default GenrePage;
