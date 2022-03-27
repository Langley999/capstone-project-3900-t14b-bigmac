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

const GenrePage = () => {
  const [genres, setGenres] = React.useState([]);
  const [authors, setAuthors] = React.useState([]);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const id = window.location.pathname.split('/')[2];
  
  React.useEffect(() =>{
    getFavGenres();
    getFavAuthors();
  }, []);

  const getFavGenres = () => {
    axios.get(`${url}/analytics/getfavgenres`, {params: {
      user_id: id
    }}).then(function (response) {
      setGenres(response['data']['genres']);
      console.log(response['data']['genres']);
      console.log(id);
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
      console.log(response['data']['authors']);
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.message));
      setSnackBarOpen(true);
    })
  }

  const CustomPieChart = ({title, value, argument, data, errorMsg, palette}) => {
    function customizeText(arg) {
      return `${arg.argument} (${arg.percentText})`;
    }
    return (
      <>
      {data.length >= 5 ? 
        <PieChart dataSource={data} palette={palette} resolveLabelOverlapping="shift" title={title}>/
        <Legend
          visible={false}
          orientation="horizontal"
          itemTextPosition="right"
          horizontalAlignment="center"
          verticalAlignment="bottom"
          columnCount={4}
        />
        <Series valueField={value} argumentField={argument}>
          <Label
            visible={true}
            position="columns"
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
    <div>
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen}/>
      <h2 style={{fontWeight: "normal"}}>Your Genres</h2>
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
        <Box m={0} p={0} style={{width: "425px", height: "100px"}}>
          <Paper elevation={3} style={{padding: "10px"}} >
            <CustomPieChart title="Top 5 Genres in Your Collections" value="percentage" argument="genre" data={genres} errorMsg="Add books to your collection to see proportion of genres" palette="Bright"/>
          </Paper>
        </Box>
        <Box m={0} p={0} style={{width: "425px", height: "100px"}}>
          <Paper elevation={3} style={{padding: "10px"}} >
            <CustomPieChart title="Top 5 Authors in Your Collections" value="percentage" argument="author" data={authors}  errorMsg="Add books to your collection to see proportion of authors" palette="Dark Violet"/>
          </Paper>
        </Box>
      </div>
    </div>
  )
}

export default GenrePage;
