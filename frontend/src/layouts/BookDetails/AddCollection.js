import axios from "axios";
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from '@mui/material/Typography';
import {url} from "../../components/Helper";

/**
 * Function to handle collection related actions in book details page
 */
const AddCollection = ({btnDisabled, setbtnDisabled,book_id,handleAddCollection,setreadingButtonText,setsnackbarcontent,setsnackbaropen,setwarningcontent,setwarningopen,cover,readingButtonText,publisher,publishdate,genres}) => {

  const handleCompleteReading = () => {
    const body = JSON.stringify( {
      token: localStorage.getItem('token'),
      book_id: book_id
    });

    axios.post(`${url}/book/completereading`, body,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      console.log(response)
      if (response['status'] === 200) {
        setbtnDisabled(true);
        setreadingButtonText('completed');
        setsnackbarcontent('Book has been added to Reading History');
        setsnackbaropen(true);
        
      }
    })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
      console.log(error);
    });
  }

  return (
    <Grid container direction="column" alignItems="center" justifyContent="flex-start" spacing={2}>
    <Grid item xs={12}>
      <Box
        component="img"
        sx={{
          width: 250,
          my:2
        }}
        alt="book cover"
        src={cover}
      />
    </Grid>
    {localStorage.getItem('token') &&
    <Grid item xs={6}>
      <Button variant="contained" style={{maxWidth: '150px', minWidth: '150px'}} startIcon={<CheckCircleOutlineIcon />} disabled={btnDisabled} onClick={handleCompleteReading}>{readingButtonText}</Button>
    </Grid>}
    {localStorage.getItem('token') &&
    <Grid item xs={6}>
      <Button variant="contained" style={{maxWidth: '150px', minWidth: '150px'}} startIcon={<LibraryAddIcon />} onClick={handleAddCollection}>Collection</Button>
    </Grid>}


    <Grid item xs={7}>
      <Box display="flex" flexDirection="column" alignItems='flex-start' >
        <Typography variant="caption" gutterBottom component="div">Publisher: <b>{publisher}</b> </Typography>
        <Typography variant="caption" gutterBottom component="div">Publish Date: <b>{publishdate}</b></Typography>
        <Box display="flex" flexDirection="row" alignItems='center' style={{width: '15rem'}}>
          <Typography variant="caption" gutterBottom component="div" style={{marginRight: '1rem'}}>Tags:</Typography>
          <Typography variant="caption" gutterBottom component="div" style={{marginTop: '0rem'}}><b>{genres}</b></Typography>
        </Box>
      </Box>

    </Grid>
  </Grid>
  )
}

export default AddCollection;