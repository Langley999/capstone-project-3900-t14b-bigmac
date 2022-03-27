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
import ErrorPopup from '../components/ErrorPopup';
import SuccessPopup from '../components/SuccessPopup';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import IconButton from '@mui/material/IconButton';
import {Link, useParams} from "react-router-dom";
import UsernameLink from '../components/UsernameLink';
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
  const u_id =  JSON.parse(localStorage.getItem('user'))['user_id'];
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
  const [genres, setGenres] = React.useState("");
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
  const book_id = searchParams.get('id');

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
        }
      })
      .catch(function (error) {
        setwarningcontent(error.response.data.message);
        setwarningopen(true);
        console.log(error);
      });
  }
  const handleSubmitReview = () => {
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

      setReviewFormOn(false);
      setreviewButtonshow(false);
      var currentdate = new Date();
      var datetime = currentdate.getFullYear() + "-"
        + (currentdate.getMonth()+1)  + "-"
        + currentdate.getDate() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

      let rev = {};
      rev['time'] = datetime;
      rev['content'] = reviewValue;
      rev['username'] = userInfo.username;
      rev['rating'] = rating;
      setReviews(review => [rev,...review] );


    })
    .catch(function (error) {

      setwarningcontent(error.response.data.message);
      setwarningopen(true);
      console.log(error);
    });
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
    })
    .then(function (response) {
      let newone = [];
      for (let i = 0; i < reviews.length; i++) {
        if (reviews[i]['username'] == userInfo['username']) {
          reviews[i]['rating'] = newValue;

        }
        newone.push(reviews[i]);
      }
      setReviews(newone);
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

    })
    .catch(function (error) {
      console.log(error);
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
      }

    })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });

    axios.get('http://127.0.0.1:8080/book/details', {
      params: {
        bookId: book_id,
        token: localStorage.getItem('token')
      }
    })
    .then(function (response) {
      console.log(response);
      setTitle(response['data']['title']);
      setBlurb(response['data']['blurb']);
      setPublishdate(response['data']['publish_date']);
      setCover(response['data']['cover_image']);
      setAuther(response['data']['author_string']);
      setPublisher(response['data']['publisher']);
      setaveRating(response['data']['average_rating'].toFixed(2));
      setN_rating(response['data']['num_rating'])
      console.log(response['data']);
      let genres = "";
      for (let i = 0; i < response['data']['genres'].length; i++) {
        genres = genres+response['data']['genres'][i];
        genres = genres+", ";
      }
      setGenres(genres);
      setReviews(response['data']['reviews'].reverse())
    })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });




  }, [window.location.href, userInfo]);

  return (
    <div>
      {genres &&
      <Box sx={{ flexGrow: 1, mt: 2,mx: -20 }} >

        <Grid container direction="row" spacing={3}>
          <Grid item xs={3}>

            <Grid container direction="column" alignItems="center" justifyContent="flex-start" spacing={2}>
              <Grid item xs={12}>
                <Box
                  component="img"
                  sx={{
                    height: 350,
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
              {localStorage.getItem('token') &&
              <Grid item xs={6}>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => {

                    handleSubmitRating(newValue);
                  }}
                />
              </Grid>}

              <Grid item xs={7}>
                <Box display="flex" flexDirection="column" alignItems='center' >
                  <Typography variant="caption" gutterBottom component="div">Publisher: {publisher}</Typography>
                  <Typography variant="caption" gutterBottom component="div">Publish Date: {publishdate}</Typography>
                  <Box display="flex" flexDirection="row" alignItems='center' style={{width: '15rem'}}>
                    <Typography variant="caption" gutterBottom component="div" style={{marginRight: '1rem'}}>Tags:</Typography>
                    <Typography variant="caption" gutterBottom component="div" style={{marginTop: '1rem'}}>{genres}</Typography>
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
                  <Grid item xs={8}>
                    <Box sx={{ flexGrow: 1, mb: 3}} >
                      <Typography variant="subtitle1" style={{ fontWeight: 800 }} gutterBottom component="div">by {authur}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box sx={{ flexGrow: 1, ml: 7}} >
                      <Rating
                        name="simple-controlled"
                        value={ave_rating}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={2}>
                    <Box sx={{ flexGrow: 1, ml: 6}} >
                      <Typography variant="caption" display="block" gutterBottom>{ave_rating} ({n_rating})</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>{blurb}</Typography>
              </Grid>



              <Grid item xs={12}>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ flexGrow: 1, mt: 8,ml: 0 }} >
                      <Typography variant="h6" gutterBottom component="div">Community Reviews</Typography>
                    </Box>
                    <Divider/>
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
                </Grid>
              </Grid>



              <Grid item xs={12}>
                {reviews.length == 0 &&  <Typography variant="h6" gutterBottom component="div">No reviews yet</Typography>}
                {reviews.length > 0 &&  reviews.map((item, i) =>
                  <Grid container direction="row" spacing={2} key={i}>

                    <Grid item xs={1}>
                      <Box
                        component="img"
                        sx={{
                          height: 50,
                          my:1
                        }}
                        alt="avatar"
                        src={item['avatar']==null?"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png":item['avatar']} 
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <Grid container direction="row" spacing={0}>
                        <Grid item xs={4}>
                          
                          {localStorage.getItem('token')==null ?
                            <Button disabled="true" style={{textTransform: "none", fontSize:"16px",width:"50px",justifyContent: "flex-start"}}>{item['username']}</Button>
                            : <Button component = {Link} to={`/user/${item['user_id']}/profile`} style={{textTransform: "none", fontSize:"16px",width:"50px",justifyContent: "flex-start"}}>{item['username']}</Button>
                            }
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="subtitle2" style={{ fontWeight: 600 }} display="block" gutterBottom> {item['time'].split(".")[0]} </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Rating
                            size="small"
                            value={item['rating']}
                            readOnly
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" display="block" gutterBottom>
                            {item['content']}
                          </Typography>
                        </Grid>
                       

                      </Grid>
                     
                     
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
                   
                  </Grid>)
                }
                {/*
              <Grid item xs={12}>
                <Box sx={{ flexGrow: 1, mt: 3,ml: 50,mb: 5}} >
                  <Pagination count={10} size="small" />
                </Box>
              </Grid>
            */}
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
                    <Box
                      component="img"
                      sx={{
                        width: 100,
                        ml: 0
                      }}
                      alt="book cover"
                      src={item['cover_image']}
                    />
                                        
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


        <Dialog open={create_form} >
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
            <Button onClick={handleCreateCollectionForm}>Create and Add to collection</Button>
          </DialogActions>

        </Dialog>
        <ErrorPopup errorMsg={warningcontent} snackBarOpen={warningopen} setSnackBarOpen={setwarningopen} />
        <SuccessPopup successMsg={snackbarcontent} snackBarOpen={snackbaropen} setSnackBarOpen={setsnackbaropen} />
      </Box>}
    </div>

  );
};
export default BookDetail;