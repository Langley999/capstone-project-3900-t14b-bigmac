import axios from "axios";
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Pagination} from "@mui/material";
import ReviewContent from './ReviewContent';
import {url} from '../../components/Helper';

/**
 * The design of book detail page for handling reviews
 */
const Review = ({book_id,u_id,userInfo,setwarningcontent,setwarningopen,setbtnDisabled,setreadingButtonText}) => {

  const [rating, setRating] = React.useState(0);
  const [page,setpage] = useState(1);
  const [reviewFormOn, setReviewFormOn] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [collection_names, setCollection_names] = React.useState([]);
  const [collection_ids, setCollection_ids] = React.useState([]);
  const [title,setTitle] = React.useState("");
  const [blurb, setBlurb] = React.useState("");

  const [authur, setAuther] = React.useState("");

  const [ave_rating, setaveRating] = React.useState(0);
  const [n_rating, setN_rating] = React.useState(0);
  const [reviewValue, setreviewValue] = React.useState(null);
  const [reviewButtonshow, setreviewButtonshow] = React.useState(true);
  const [reviews, setReviews] =  React.useState([]);
  const open = Boolean(anchorEl);
  const [myreview,setmyreview] = useState([]);
  const [sort, setSort] = useState("time");
  const [reviewform, setReviewform] = useState(false);
  const [newreview, setNewreview] = useState("");
  const handleAddReviewClose = () => {
    setReviewFormOn(false);
  }
  const handleSubmitNewReview = () => {
    const body = JSON.stringify( {
      token: localStorage.getItem('token'),
      review_id: myreview[0].review_id,
      review: newreview
    });

    axios.post(`${url}/book/editreview`, body,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      if (response['status'] === 200) {
        setReviewform(false);
        setNewreview("");
        axios.get(`${url}/book/ownreview`, {
          params: {
            token: localStorage.getItem('token'),
            bookId: book_id
          }
        }).then(function(response){
          setmyreview(response['data']['review']);
        });
      }
    })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });
  }
  const handleCloseReviewForm = () => {
    setReviewform(false);
  }

  const handleChangePage = (event, value) => {
    setpage(value);
    axios.get(`${url}/book/details`, {
      params: {
        bookId: book_id,
        token: localStorage.getItem('token'),
        page:value
      }
    })
    .then(function (response) {
      setReviews(response['data']['reviews'].reverse())
    })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });

  }
  const handleChangeSort = (event) => {
    setSort(event.target.value);
    axios.get(`${url}/book/details`, {
      params: {
        bookId: book_id,
        token: localStorage.getItem('token'),
        page:1,
        sort: event.target.value
      }
    })
    .then(function (response) {
      setReviews(response['data']['reviews']);
    })
    .catch(function (error) {
      setwarningcontent(error);
      setwarningopen(true);
    });
  };
  const handleAddReview = () => {
    setReviewFormOn(true);
  }

  const handleEditReview = (review_id) => {
   setReviewform(true);
  }

  const  handleLikeReview = (review_id) => {
    const body = JSON.stringify( {
      token: localStorage.getItem('token'),
      review_id: review_id
    });

    axios.post(`${url}/book/likereview`, body,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      if (response['status'] === 200) {
        for (var i = 0; i < reviews.length; i++) {
          let reviewsCopy = [...reviews];
          if (reviewsCopy[i]['review_id'] === review_id) {
            reviewsCopy[i]['likes'] ++;
            reviewsCopy[i]['is_liked'] = true;
            setReviews(reviewsCopy);
          }
        }
        
        let reviewsCopy = [...myreview];
        if (reviewsCopy[0]['review_id'] === review_id) {
          reviewsCopy[0]['likes'] ++;
          reviewsCopy[0]['is_liked'] = true;
          setmyreview(reviewsCopy);
        }
      }
    })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });

  }
  const  handleUnlikeReview = (review_id) => {
    const body = JSON.stringify( {
      token: localStorage.getItem('token'),
      review_id: review_id
    });

    axios.post(`${url}/book/unlikereview`, body,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      if (response['status'] === 200) {
        for (var i = 0; i < reviews.length; i++) {
          let reviewsCopy = [...reviews];
          if (reviewsCopy[i]['review_id'] === review_id) {
            reviewsCopy[i]['likes'] --;
            reviewsCopy[i]['is_liked'] = false;
            setReviews(reviewsCopy);
          }
        }
        let reviewsCopy = [...myreview];
        if (reviewsCopy[0]['review_id'] === review_id) {
          reviewsCopy[0]['likes'] --;
          reviewsCopy[0]['is_liked'] = false;
          setmyreview(reviewsCopy);
        }
      }
    })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });
  }
  const handleSubmitReview = () => {
    if (rating === 0) {
      setwarningcontent("Please select a rating!");
      setwarningopen(true);
    } else if (reviewValue === "") { 
      setwarningcontent("Please enter a review!");
      setwarningopen(true);
    } else {
      const body = JSON.stringify( {
        book_id: book_id,
        review: reviewValue,
        rating: rating,
        token: localStorage.getItem('token')
      });
      axios.post(`${url}/book/ratings_reviews`, body,{
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function (response) {
        setReviewFormOn(false);
        setreviewButtonshow(false);
        axios.get(`${url}/book/ownreview`, {
          params: {
            token: localStorage.getItem('token'),
            bookId: book_id
          }
        }).then(function(response){
          setmyreview(response['data']['review']);
        });
        setreviewValue("");
        setbtnDisabled(true);
        setreadingButtonText('completed');
      })
      .catch(function (error) {
        setwarningcontent(error.response.data.message);
        setwarningopen(true);
      });
    }
  }

  const handleSubmitRating = (newValue) => {
    const body = JSON.stringify( {
      book_id: book_id,
      rating: newValue,
      token: localStorage.getItem('token')
    });
    axios.post(`${url}/book/ratings`, body,{
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      if (rating == 0) {
        let newrating = (newValue+n_rating*ave_rating)/(n_rating+1);
        setN_rating(n_rating+1);
        setaveRating(newrating.toFixed(2));
        setRating(newValue);
        console.log('success');
      } else {
        let newrating = (newValue+n_rating*ave_rating-rating)/n_rating;
        setaveRating(newrating.toFixed(2));
        setRating(newValue);
      }
      setbtnDisabled(true);
      setreadingButtonText('completed');
      axios.get(`${url}/book/ownreview`, {
        params: {
          token: localStorage.getItem('token'),
          bookId: book_id
        }
      }).then(function(response){
        setmyreview(response['data']['review']);
      });
    })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });
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
        console.log(collections[i]);
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

      } else {
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
      setTitle(response['data']['title']);
      setBlurb(response['data']['blurb']);
      if (response['data']['author_string'] === "") {
        setAuther('unknown');
      } else {
        setAuther(response['data']['author_string']);        
      }
      setaveRating(response['data']['average_rating'].toFixed(2));
      setN_rating(response['data']['num_rating'])
      setReviews(response['data']['reviews']);
    })
    .catch(function (error) {
      setwarningcontent(error);
      setwarningopen(true);
    });
  }, [window.location.href, userInfo]);

  return (
    <Grid container direction="row" spacing={1}>
    <Grid item xs={12}>
      <Typography variant="h4" style={{ fontWeight: 500,paddingTop:10 }} gutterBottom component="div">{title}</Typography>
    </Grid>
    <Grid item xs={12}>
      <Grid container direction="row" spacing={0}>
        <Grid item xs={7}>
          <Box sx={{ flexGrow: 1, mb: 3}} >
            <Typography variant="subtitle1" style={{ fontWeight: 800 }} gutterBottom component="div">by {authur}</Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box sx={{ flexGrow: 1, ml: 5}} >
            <Rating
              name="simple-controlled"
              value={ave_rating}
              precision={0.1}
              size="small"
              readOnly
            />
          </Box>
        </Grid>

        <Grid item xs={3}>
          <Box sx={{ flexGrow: 1, ml: 3}} >
            <Typography variant="caption" display="block" gutterBottom>{ave_rating} ({n_rating} rating{n_rating === 1? <></>: <>s</> })</Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12}>
      <Typography variant="body1" gutterBottom>{blurb}</Typography>
    </Grid>


    <Grid item xs={12} >
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ flexGrow: 1, mt: 8,ml: 0 }} >
            <Typography variant="h6" gutterBottom component="div">Community Reviews</Typography>
          </Box>
          <Divider sx={{ mb: 2}}/>
        </Grid>
        {localStorage.getItem('token') &&
        <Grid item xs={2}>
          <Box sx={{ flexGrow: 1, mt: 1}}>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {

                handleSubmitRating(newValue);
              }}
            />
          </Box>
        </Grid>}
        {localStorage.getItem('token') &&
        <Grid item xs={5}>
          {reviewButtonshow &&
          <Button startIcon={<DriveFileRenameOutlineIcon />} onClick={() => handleAddReview()}>Add Review</Button>}
        </Grid>}
        <FormControl >
          <InputLabel style ={{width: '100%'}} id="demo-simple-select-label">Sort by </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sort}
            label="Time"
            onChange={handleChangeSort}
            autoWidth
            style={{ fontSize:14,height: 40 }}
          >
            <MenuItem value={'time'}>Time</MenuItem>
            <MenuItem value={'likes'}>Likes</MenuItem>
            <MenuItem value={'badges'}>Badges</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>

    <Grid item xs={12} >

      {(reviews.length == 0 && myreview.length == 0) &&  <Typography variant="h6" gutterBottom component="div">No reviews yet</Typography>}
      
      {myreview.length > 0 &&  myreview.map((item, i) =>
      <Grid container direction="row" spacing={0} key={i} style={{ marginBottom: 0 }} >
        <Grid item xs = {10}>
          <ReviewContent item={item} i = {i}></ReviewContent>
        </Grid>
        <Grid item xs={1} style={{ marginLeft: -62}}> 
          <IconButton aria-label="edit" size="small" onClick={() => handleEditReview(item['review_id'])}>
              <EditIcon fontSize="inherit" color="white" style={{ color: 'white',backgroundColor: '#1976d2' , borderRadius:'15px',padding: '4px'}}/> 
          </IconButton>                      
        </Grid>
        { localStorage.getItem('token') && item['is_liked'] === false && <Grid item xs={1}>
          <IconButton aria-label="delete" size="small" onClick={() => handleLikeReview(item['review_id'])}>
            <ThumbUpOffAltIcon fontSize="inherit" /> 
          </IconButton>
            {item['likes']}
          </Grid>}
        { localStorage.getItem('token') && item['is_liked'] && <Grid item xs={1}>
          <IconButton aria-label="delete" size="small" onClick={() => handleUnlikeReview(item['review_id'])}>
            <ThumbUpIcon fontSize="inherit" /> 
          </IconButton>
            {item['likes']}
        </Grid>}
    
        { localStorage.getItem('token') === null && <Grid item xs={1}>
          <IconButton aria-label="delete" size="small" disabled>
            <ThumbUpOffAltIcon fontSize="inherit" /> 
          </IconButton>
            {item['likes']}      
          </Grid>}         
      </Grid>

      )}
      {reviews.length > 0 &&  reviews.map((item, i) =>
      <Grid container direction="row" spacing={0} key={i} style={{ marginBottom: 0 }} >
        <Grid item xs = {10}>
          <ReviewContent item={item} i = {i}></ReviewContent>
        </Grid>
          { localStorage.getItem('token') && item['is_liked'] === false && <Grid item xs={1}>
          <IconButton aria-label="delete" size="small" onClick={() => handleLikeReview(item['review_id'])}>
            <ThumbUpOffAltIcon fontSize="inherit" /> 
          </IconButton>
            {item['likes']}
        </Grid>}
        { localStorage.getItem('token') && item['is_liked'] && <Grid item xs={1}>
          <IconButton aria-label="delete" size="small" onClick={() => handleUnlikeReview(item['review_id'])}>
            <ThumbUpIcon fontSize="inherit" /> 
          </IconButton>
            {item['likes']}
        </Grid>}
    
        { localStorage.getItem('token') === null && <Grid item xs={1}>
          <IconButton aria-label="delete" size="small" disabled>
            <ThumbUpOffAltIcon fontSize="inherit" /> 
          </IconButton>
            {item['likes']}      
          </Grid>}         
      </Grid>

      )}

    {reviews.length > 0 &&
      <Grid container direction="row" justifyContent="center" spacing={2}  style={{ marginTop: 40 }} >
        <Pagination count={reviews['pages']} page={1} onChange={handleChangePage} />
      </Grid>
    }

    </Grid>
    <Dialog open={reviewform} onClose={handleCloseReviewForm}>
        <DialogTitle>Enter new review</DialogTitle>
        <DialogContent>
          <TextField 
            style={{ width: '500px' }}
            fullWidth label="" id="fullWidth" multiline={true} value={newreview}
            onChange={(e) => setNewreview(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewForm}>Cancel</Button>
          <Button onClick={handleSubmitNewReview}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog onClose={handleAddReviewClose} open={reviewFormOn}>
          <Box
            sx={{
              width: 1000,
              height: 500,
              maxWidth: '100%',
            }}
          >
            <Grid container direction="column" alignItems="center" justifyContent="flex-start" spacing={0}>
              <DialogTitle>Write a review</DialogTitle>
              <Rating
                name="simple-controlled"
                value={rating}
                onChange={(event, newValue) => {
                  handleSubmitRating(newValue);
                }}
              />
              <Box
                sx={{
                  paddingTop:3,
                  width: 500,
                  maxWidth: '100%',
                }}
              >
                <TextField fullWidth label="" id="fullWidth" multiline={true} value={reviewValue}
                           onChange={(e) => setreviewValue(e.target.value)} rows={12} />
              </Box>
              <Button onClick={handleSubmitReview}>Submit</Button>
            </Grid>
          </Box>
        </Dialog>
  </Grid>
  )
}
export default Review;