import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import ErrorPopup from '../../components/ErrorPopup';
import SuccessPopup from '../../components/SuccessPopup';
import {convertDate,months} from '../../components/Helper';
import AddCollection from './AddCollection';
import SimilarBooks from './SimilarBooks';
import {url} from '../../components/Helper';

import Review from './Review';

/**
 * Book detail page: contains all actions and information about a book
 */
const BookDetail = ({userInfo, updateTabValue}) => {
  let u_id = -1;
  if (localStorage.getItem('user')) {
    u_id =  JSON.parse(localStorage.getItem('user'))['user_id'];
  }
  
  const [rating, setRating] = React.useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [collection_names, setCollection_names] = React.useState([]);
  const [collection_ids, setCollection_ids] = React.useState([]);
  const [create_form, setCreateForm] = React.useState(false);
  const [textFieldValue, settextFieldValue] = React.useState('');
  const [readingButtonText, setreadingButtonText] = React.useState('Complete');
  const [btnDisabled, setbtnDisabled] = React.useState(false);
  const [publishdate, setPublishdate] = React.useState('');
  const [reviewButtonshow, setreviewButtonshow] = React.useState(true);
  const [cover, setCover] = React.useState('');
  const [publisher, setPublisher] = React.useState('');
  const [genres, setGenres] = React.useState('None');

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [searchParams, setSearchParams] = useSearchParams();
  const [snackbaropen,setsnackbaropen] = useState(false);
  const [snackbarcontent, setsnackbarcontent] = useState('');
  const [warningopen,setwarningopen] = useState(false);
  const [warningcontent, setwarningcontent] = useState('');
  const [myreview,setmyreview] = useState([]);
  const [sort, setSort] = useState('time');
  const [numCompleted, setNumCompleted] = useState(0);
  const book_id = searchParams.get('id');
  
  const handleAddCollection = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleAddCollectionClose = () => {
    setAnchorEl(null);
  }
  const handleCreateCollection = () => {
    setCreateForm(true);
  }

  const handleCreateCollectionForm = () => {
    const body = JSON.stringify( {
      name: textFieldValue,
      token: localStorage.getItem('token')
    });
    axios.post(`${url}/collection/create`, body,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        let c_id = response['data']['id'];
        if (response['status'] === 200) {
          let json = JSON.stringify( {
            collection_id: c_id,
            token: localStorage.getItem('token'),
            book_id: book_id
          });
          axios.post(`${url}/collection/addbook`, json,{
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(function (response) {
            if (response['status'] === 200) {
              
              setsnackbarcontent('Book has been added to new collection');
              setsnackbaropen(true);
              setCreateForm(false);
              settextFieldValue('');
              setAnchorEl(null);
              setCollection_ids([...collection_ids, c_id]);
              setCollection_names([...collection_names, textFieldValue]);
            }
          })
          .catch(function (error) {
            setwarningcontent(error.response.data.message);
            setwarningopen(true);
          });

        }
      })
      .catch(function (error) {
        setwarningcontent(error.response.data.message);
        setwarningopen(true);
      });
  }

  const closeDialog = () => {
    setCreateForm(false);
  }
   
  const handleAddToCollection = (key) => {
    axios.post(`${url}/collection/addbook`, {
      token: localStorage.getItem('token'),
      collection_id: key,
      book_id: book_id
    }).then(res => {

      setsnackbarcontent('Book has been added to collection');
      setsnackbaropen(true);
      setAnchorEl(null);
    }).catch(error => {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    })

  }
  useEffect(() => {
    axios.get(`${url}/collection/getall`, {
      params: {
        user_id: u_id
      }
    })
    .then(function (response) {
      let collections = response['data']['collections'];
      let clist = [];
      let nlist = [];
      for (let i = 0; i < collections.length; i++) {
        if (collections[i]['flag'] !== 2){
          clist.push(collections[i]['name']);
          nlist.push(collections[i]['id']);
        }
      }
      setCollection_names(clist);
      setCollection_ids(nlist);   
  })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });

    axios.get(`${url}/book/numreads`, {
      params: {bookId: book_id}
    })
    .then(function(response) {
      setNumCompleted(response['data']['num_reads']);
    }).catch(function(error){
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });

    axios.get(`${url}/book/reviews`, {
      params: {
        token: localStorage.getItem('token'),
        bookId: book_id
      }
    })
    .then(function (response) {
      let review = response['data']['reviews'];
      if (review.length > 0) {
        setRating(review[0]['rating']);
        if (review[0]['content'] != null) {
          setreviewButtonshow(false);
        }
      }
      else {
        setRating(0);
        setreviewButtonshow(true);
      }

    })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });

    axios.get(`${url}/book/ownreview`, {
      params: {
        token: localStorage.getItem('token'),
        bookId: book_id
      }
    }).then(function(response){
      console.log(response['data']['review'])
      setmyreview(response['data']['review']);
    });
    axios.get(`${url}/book/check_completed`, {
      params: {
        token: localStorage.getItem('token'),
        bookId: book_id

      }
    })
    .then(function (response) {
      if (response['data']['success'] == true) {
        setbtnDisabled(true);
        setreadingButtonText('completed');
      } else {
        setbtnDisabled(false);
        setreadingButtonText('complete');
      }
    })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });

    axios.get(`${url}/book/details`, {
      params: {
        bookId: book_id,
        token: localStorage.getItem('token'),
        page:1,
        sort: sort
      }
    })
    .then(function (response) {
      if (response['data']['publish_date'] === '' ) {
        setPublishdate('Not Available');
      } else {
        if (months.includes(response['data']['publish_date'].split(' ')[0]) ) {
          let converteddate = convertDate(response['data']['publish_date']);
          setPublishdate(converteddate);
        } else {
          setPublishdate(response['data']['publish_date']);
        } 
      }
      
      if (response['data']['publisher'] === '') {
        setPublisher('Not Available');
      } else {
        setPublisher(response['data']['publisher']);
      }
     
      let genres = '';
      for (let i = 0; i < response['data']['genres'].length; i++) {
        genres = genres+response['data']['genres'][i];
        genres = genres+', ';
      }
      if (genres !== '') {
        genres = genres.substring(0,genres.length-2);
      }
  
      if (genres === '') {
        genres = 'None';
      }
      setGenres(genres);
      if (response['data']['cover_image']==='') {
        setCover('https://islandpress.org/sites/default/files/default_book_cover_2015.jpg');
      } else{
        setCover(response['data']['cover_image']);
      }

    })
    .catch(function (error) {
      setwarningcontent(error);
      setwarningopen(true);
    });

  }, [window.location.href, userInfo]);


  return (
    <div>
      {cover &&
      <Box sx={{ flexGrow: 1, mt: 2,mx: -20 }} >

        <Grid container direction='row' spacing={3}>
          <Grid item xs={3}>
            <AddCollection numCompleted={numCompleted} setNumCompleted={setNumCompleted} btnDisabled={btnDisabled} setbtnDisabled={setbtnDisabled} book_id={book_id} setreadingButtonText={setreadingButtonText} setsnackbarcontent={setsnackbarcontent} setsnackbaropen={setsnackbaropen}
            setwarningcontent={setwarningcontent} setwarningopen={setwarningopen} cover={cover} readingButtonText={readingButtonText} publisher={publisher}
            publishdate={publishdate} genres={genres} handleAddCollection={handleAddCollection} />
          </Grid>

          <Grid item xs={6}>
            <Review book_id={book_id} u_id={u_id} userInfo={userInfo} setwarningcontent={setwarningcontent} setwarningopen={setwarningopen} setbtnDisabled={setbtnDisabled} setreadingButtonText={setreadingButtonText} updateTabValue={updateTabValue}/>
          </Grid>
          <Grid item xs={3}>
              <SimilarBooks book_id={book_id} setwarningopen={setwarningopen} />
          </Grid>
        </Grid>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleAddCollectionClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Typography sx={{ p: 2 }}>Add to collection</Typography>
          <Grid container direction='column' spacing={0}>
            <Button startIcon={<AddIcon />} onClick={() => handleCreateCollection()}>Create</Button>
            {collection_names && collection_names.length >0 &&
            collection_names.map((item, i) =>
              
              <Button key={collection_ids[i]} onClick={() => handleAddToCollection(collection_ids[i])} >{item}</Button>
            )
            }
          </Grid>

        </Popover>


        <Dialog open={create_form} onClose={closeDialog}>
          
          <DialogTitle>Create a new collection to add this book</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter your new collection name
            </DialogContentText>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              label='collection name'
              type='text'
              fullWidth
              variant='standard'
              value={textFieldValue}
              onChange={(e) => settextFieldValue(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            
            <Button type='submit' onClick={handleCreateCollectionForm}>Create and Add to collection</Button>
          </DialogActions>

        </Dialog>

      </Box>}

      <ErrorPopup errorMsg={warningcontent} snackBarOpen={warningopen} setSnackBarOpen={setwarningopen} />
      <SuccessPopup successMsg={snackbarcontent} snackBarOpen={snackbaropen} setSnackBarOpen={setsnackbaropen} />
    </div>

  );
};
export default BookDetail;