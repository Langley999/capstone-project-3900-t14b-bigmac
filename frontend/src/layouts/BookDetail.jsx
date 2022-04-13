import axios from "axios";
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { makeStyles } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import ErrorPopup from '../components/ErrorPopup';
import SuccessPopup from '../components/SuccessPopup';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import IconButton from '@mui/material/IconButton';
import {Link, useParams} from "react-router-dom";
import UsernameLink from '../components/UsernameLink';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Pagination} from "@mui/material";
import Avatar from '@mui/material/Avatar';
import {convertDate,months} from '../components/Helper';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Review from '../components/Review';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles({
  root: {
    background: '#2f7c31',
    border: 0,
    borderRadius: 3,
    color: 'white',
    padding: '0 30px',
  },
  warning: {
    background: '#d32f2f',
    border: 0,
    borderRadius: 3,
    color: 'white',
    padding: '0 30px',
  }
});

const BookDetail = ({userInfo}) => {
  let u_id = -1;
  if (localStorage.getItem('user')) {
    u_id =  JSON.parse(localStorage.getItem('user'))['user_id'];
  }
  
  //console.log(userInfo)
  const classes = useStyles();
  const [rating, setRating] = React.useState(0);

  const [reviewFormOn, setReviewFormOn] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [collection_names, setCollection_names] = React.useState([]);
  const [collection_ids, setCollection_ids] = React.useState([]);
  const [create_form, setCreateForm] = React.useState(false);
  const [textFieldValue, settextFieldValue] = React.useState("");
  const [readingButtonText, setreadingButtonText] = React.useState("Complete");
  const [btnDisabled, setbtnDisabled] = React.useState(false);
  const [title,setTitle] = React.useState("");
  const [blurb, setBlurb] = React.useState("");
  const [publishdate, setPublishdate] = React.useState("");
  const [authur, setAuther] = React.useState("");
  const [cover, setCover] = React.useState("");
  const [publisher, setPublisher] = React.useState("");
  const [genres, setGenres] = React.useState("None");
  const [ave_rating, setaveRating] = React.useState(0);
  const [n_rating, setN_rating] = React.useState(0);
  const [reviewValue, setreviewValue] = React.useState(null);
  const [reviewButtonshow, setreviewButtonshow] = React.useState(true);
  const [reviews, setReviews] =  React.useState([]);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [searchParams, setSearchParams] = useSearchParams();
  const [snackbaropen,setsnackbaropen] = useState(false);
  const [snackbarcontent, setsnackbarcontent] = useState("");
  const [warningopen,setwarningopen] = useState(false);
  const [warningcontent, setwarningcontent] = useState("");
  const [similarbooks, setSimilarbooks] = useState([]);
  const [page,setpage] = useState(1);
  const [myreview,setmyreview] = useState([]);
  const [sort, setSort] = useState("time");
  const [reviewform, setReviewform] = useState(false);
  const [newreview, setNewreview] = useState("");
  const book_id = searchParams.get('id');
  
  const handleSubmitNewReview = () => {
    const body = JSON.stringify( {
      token: localStorage.getItem('token'),
      review_id: myreview[0].review_id,
      review: newreview
    });

    axios.post('http://127.0.0.1:8080/book/editreview', body,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        console.log(response)
        if (response['status'] === 200) {
          setReviewform(false);
          setNewreview("");
          axios.get('http://127.0.0.1:8080/book/ownreview', {
            params: {
              token: localStorage.getItem('token'),
              bookId: book_id
            }
          }).then(function(response){
            console.log(response['data']['review'])
            setmyreview(response['data']['review']);
          });

        }
      })
      .catch(function (error) {
        setwarningcontent(error.response.data.message);
        setwarningopen(true);
        console.log(error);
      });
    
  }
  const handleCloseReviewForm = () => {
    setReviewform(false);
  }
  const handleChangeSort = (event) => {
    setSort(event.target.value);
    axios.get('http://127.0.0.1:8080/book/details', {
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
  const handleAddCollection = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleAddReviewClose = () => {
    setReviewFormOn(false);
  }
  const handleAddCollectionClose = () => {
    setAnchorEl(null);
  }
  const handleCreateCollection = () => {
    setCreateForm(true);
  }

  const handleChangePage = (event, value) => {
    setpage(value);
    axios.get('http://127.0.0.1:8080/book/details', {
      params: {
        bookId: book_id,
        token: localStorage.getItem('token'),
        page:value
      }
    })
    .then(function (response) {
      console.log(response);

      setReviews(response['data']['reviews'].reverse())
    })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });

  }

  const handleEditReview = (review_id) => {
   setReviewform(true);
  }


  const  handleLikeReview = (review_id) => {
    const body = JSON.stringify( {
      token: localStorage.getItem('token'),
      review_id: review_id
    });

    axios.post('http://127.0.0.1:8080/book/likereview', body,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        console.log(response)
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
        console.log(error);
      });

  }
  const  handleUnlikeReview = (review_id) => {

    const body = JSON.stringify( {
      token: localStorage.getItem('token'),
      review_id: review_id
    });

    axios.post('http://127.0.0.1:8080/book/unlikereview', body,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        console.log(response)
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
        console.log(error);
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
      axios.post('http://127.0.0.1:8080/book/ratings_reviews', body,{
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function (response) {
        console.log(response.data.review_id)
        setReviewFormOn(false);
        setreviewButtonshow(false);
        axios.get('http://127.0.0.1:8080/book/ownreview', {
          params: {
            token: localStorage.getItem('token'),
            bookId: book_id
          }
        }).then(function(response){
          console.log(response['data']['review'])
          setmyreview(response['data']['review']);
        });
        setreviewValue("");
        setbtnDisabled(true);
        setreadingButtonText('completed');
      })
      .catch(function (error) {
  
        setwarningcontent(error.response.data.message);
        setwarningopen(true);
        console.log(error);
      });
    }

  }

  const handleSubmitRating = (newValue) => {

    const body = JSON.stringify( {
      book_id: book_id,
      rating: newValue,
      token: localStorage.getItem('token')
    });
    axios.post('http://127.0.0.1:8080/book/ratings', body,{
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
      axios.get('http://127.0.0.1:8080/book/ownreview', {
        params: {
          token: localStorage.getItem('token'),
          bookId: book_id
        }
      }).then(function(response){
        console.log(response['data']['review'])
        setmyreview(response['data']['review']);
      });
    })
    .catch(function (error) {

      setwarningcontent(error.response.data.message);
      setwarningopen(true);
      console.log(error);
    });
  }


  const handleCompleteReading = () => {
    const body = JSON.stringify( {
      token: localStorage.getItem('token'),
      book_id: book_id
    });

    axios.post('http://127.0.0.1:8080/book/completereading', body,{
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
  const handleCreateCollectionForm = () => {
    const body = JSON.stringify( {
      name: textFieldValue,
      token: localStorage.getItem('token')
    });
    axios.post('http://127.0.0.1:8080/collection/create', body,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        console.log(response);
        let c_id = response['data']['id'];
        if (response['status'] === 200) {
          let json = JSON.stringify( {
            collection_id: c_id,
            token: localStorage.getItem('token'),
            book_id: book_id
          });
          axios.post('http://127.0.0.1:8080/collection/addbook', json,{
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(function (response) {
            console.log(response);
            if (response['status'] === 200) {
              
              setsnackbarcontent('Book has been added to new collection');
              setsnackbaropen(true);
              setCreateForm(false);
              settextFieldValue("");
              setAnchorEl(null);
              setCollection_ids([...collection_ids, c_id]);
              setCollection_names([...collection_names, textFieldValue]);
            }
          })
          .catch(function (error) {
            setwarningcontent(error.response.data.message);
            setwarningopen(true);
            console.log(error);
          });

        }
      })
      .catch(function (error) {
        setwarningcontent(error.response.data.message);
        setwarningopen(true);
        console.log(error);
        /*
        setwarningcontent(error);
        setwarningopen(true);*/
      });
  }

  const closeDialog = () => {
    setCreateForm(false);
  }
   
  const handleAddToCollection = (key) => {

    axios.post('http://127.0.0.1:8080/collection/addbook', {
      token: localStorage.getItem('token'),
      collection_id: key,
      book_id: book_id
    }).then(res => {

      setsnackbarcontent("Book has been added to collection");
      setsnackbaropen(true);
      setAnchorEl(null);
    }).catch(error => {
      console.log(error.response);
 
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    })

  }
  useEffect(() => {
    
    axios.get('http://127.0.0.1:8080//book/similarbooks', {
      params: {
        book_id: book_id

      }
    })
    .then(function (response) {
      console.log(response['data']['books']);
      
      setSimilarbooks(response['data']['books']);
    })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });

    axios.get('http://127.0.0.1:8080/collection/getall', {
      params: {
        user_id: u_id
      }
    })
    .then(function (response) {
      console.log(response);
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

    axios.get('http://127.0.0.1:8080/book/reviews', {
      params: {
        token: localStorage.getItem('token'),
        bookId: book_id
      }
    })
    .then(function (response) {
      console.log(response);
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
      console.log(error);
    });

    axios.get('http://127.0.0.1:8080/book/ownreview', {
      params: {
        token: localStorage.getItem('token'),
        bookId: book_id
      }
    }).then(function(response){
      console.log(response['data']['review'])
      setmyreview(response['data']['review']);
    });
    axios.get('http://127.0.0.1:8080/book/check_completed', {
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

    axios.get('http://127.0.0.1:8080/book/details', {
      params: {
        bookId: book_id,
        token: localStorage.getItem('token'),
        page:1,
        sort: sort
      }
    })
    .then(function (response) {
      console.log(response);
      setTitle(response['data']['title']);
      setBlurb(response['data']['blurb']);
      console.log("=======");
      console.log(response['data']['publish_date'])
      if (response['data']['publish_date'] === "" ) {
        setPublishdate('Not Available');
      } else {
        if (months.includes(response['data']['publish_date'].split(' ')[0]) ) {
          let converteddate = convertDate(response['data']['publish_date']);
          setPublishdate(converteddate);
        } else {
          setPublishdate(response['data']['publish_date']);
        } 
      }
      
      if (response['data']['author_string'] === "") {
        setAuther('unknown');
      } else {
        setAuther(response['data']['author_string']);        
      }
      

      if (response['data']['publisher'] === "") {
        setPublisher('Not Available');
      } else {
        setPublisher(response['data']['publisher']);
      }
     
      setaveRating(response['data']['average_rating'].toFixed(2));
      setN_rating(response['data']['num_rating'])
      console.log(response['data']);
      let genres = "";
      for (let i = 0; i < response['data']['genres'].length; i++) {
        genres = genres+response['data']['genres'][i];
        genres = genres+", ";
      }
      if (genres !== "") {
        genres = genres.substring(0,genres.length-2);
        //console.log(genres.substring(0,genres.length-1))
      }
  
      if (genres === "") {
        genres = "None";
      }
      setGenres(genres);
      setReviews(response['data']['reviews']);
      console.log(response['data']['reviews']);
      if (response['data']['cover_image']==="") {
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

        <Grid container direction="row" spacing={3}>
          <Grid item xs={3}>

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
          </Grid>

          <Grid item xs={6}>
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
                    <Review item={item} i = {i}></Review>
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
                    <Review item={item} i = {i}></Review>
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

            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container direction="column" alignItems="center" justifyContent="flex-start" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" display="block" gutterBottom>
                  You may also like ...
                </Typography>
              </Grid>
              {similarbooks.length > 0 &&  similarbooks.map((item, i) =>
                  
              <Grid item xs={12} style={{textAlign: "center"}} key={i}>
                <Grid container direction="column" alignItems="center" justifyContent="flex-start" spacing={2}>
                  <Grid item xs={12} style={{textAlign: "center"}}>
                  <Box component={Link} to={`/book/?id=${item['id']}`}  >
                    <Box
                      component="img"
                      sx={{
                        width: 100,
                        ml: 0
                      }}
                      alt="book cover"
                      src={item['cover_image']}
                    />
                  </Box>               
                  </Grid>
                  <Grid item xs={12} style={{textAlign: "center"}}> 
                    <Box component={Link} to={`/book/?id=${item['id']}`} style={{width: "600px"}} >
                      <Button color="primary" style={{width: "150px"}}>
                        {item['title']}
                      </Button>               
                    </Box>
                  </Grid>

                </Grid>
              </Grid>
              
              )}

            </Grid>
          </Grid>
        </Grid>

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
          <Grid container direction="column" spacing={0}>
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
              margin="dense"
              id="name"
              label="collection name"
              type="text"
              fullWidth
              variant="standard"
              value={textFieldValue}
              onChange={(e) => settextFieldValue(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            
            <Button type="submit" onClick={handleCreateCollectionForm}>Create and Add to collection</Button>
          </DialogActions>

        </Dialog>

      </Box>}
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
      <ErrorPopup errorMsg={warningcontent} snackBarOpen={warningopen} setSnackBarOpen={setwarningopen} />
      <SuccessPopup successMsg={snackbarcontent} snackBarOpen={snackbaropen} setSnackBarOpen={setsnackbaropen} />
    </div>

  );
};
export default BookDetail;