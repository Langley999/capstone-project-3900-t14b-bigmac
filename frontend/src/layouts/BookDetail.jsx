import axios from "axios";
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Pagination from '@mui/material/Pagination';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const BookDetail = ({userInfo}) => {
  //console.log(userInfo)

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
  const handleSubmitReview = () => {
    const body = JSON.stringify( {
      book_id: book_id,
      review: reviewValue,
      rating: rating,
      email: userInfo.email,
      token: localStorage.getItem('token')
    });
    axios.post('http://127.0.0.1:8080/book/ratings_reviews', body,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      alert('success');
      setReviewFormOn(false);
      setreviewButtonshow(false);
      
    })
    .catch(function (error) {
      alert(error);
      console.log(error);
    });
  }

  const handleSubmitRating = (newValue) => {
    const body = JSON.stringify( {
      book_id: book_id,
      rating: newValue,
      email: userInfo.email,
      token: localStorage.getItem('token')
    });
    axios.post('http://127.0.0.1:8080/book/ratings', body,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      console.log('success');  
    })
    .catch(function (error) {
      alert(error);
      console.log(error);
    });
  }


  const handleCompleteReading = () => {
    const body = JSON.stringify( {
      email: userInfo.email,
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
        }
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  }
  const handleCreateCollectionForm = () => {
    const body = JSON.stringify( {
      name: textFieldValue,
      email: userInfo.email,
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
            email: userInfo.email,
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
                alert('success');
                setCreateForm(false);
                settextFieldValue("");
                setAnchorEl(null);
              }
            })
            .catch(function (error) {
              alert(error);
              console.log(error);
            });

        }
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  }
  const handleAddToCollection = (key) => {
    console.log(key)
    const body = JSON.stringify( {
      collection_id: key,
      email: userInfo.email,
      book_id: book_id
    });

    console.log(key)

    axios.post('http://127.0.0.1:8080/collection/addbook', {
      email: userInfo.email,
      collection_id: key,
      book_id: book_id
    }).then(res => {
      alert("add book success!");
      setAnchorEl(null);
    }).catch(error => {
      alert(error.response.data.message);
    })


    // axios.post('http://127.0.0.1:8080/collection/addbook', body,{
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    //   .then(function (response) {
    //     console.log(response)
    //     if (response['status'] === 200) {
    //       alert('success');
    //       setAnchorEl(null);
    //     }
    //   })
    //   .catch(function (error) {
    //     alert(error);
    //     console.log(error);
    //   });
  }
  useEffect(() => {
    // Update the document title using the browser API
    axios.get('http://127.0.0.1:8080/collection/getall', {
      params: {
        user: userInfo.username
      }
    })
      .then(function (response) {
        console.log(response);
        let collections = response['data']['collections'];
        let clist = [];
        let nlist = [];
        for (let i = 0; i < collections.length; i++) {
          // Runs 5 times, with values of step 0 through 4.
          console.log(collections[i]);
          clist.push(collections[i]['name']);
          nlist.push(collections[i]['id']);
          setCollection_names(clist);
          setCollection_ids(nlist);
        }

      })
      .catch(function (error) {
        console.log(error);
      });

    axios.get('http://127.0.0.1:8080/book/reviews', {
      params: {
        email: userInfo.email,
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
        email: userInfo.email,
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
      console.log(error);
    });

    axios.get('http://127.0.0.1:8080/book/details', {
      params: {
        bookId: book_id
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
        setaveRating(response['data']['average_rating']);
        setN_rating(response['data']['num_rating'])
        console.log(response['data']['author_string']);
        let genres = "";
        for (let i = 0; i < response['data']['genres'].length; i++) {
          genres = genres+response['data']['genres'][i];
          genres = genres+", ";
        }
        setGenres(genres);
        setReviews(response['data']['reviews'])
      })
      .catch(function (error) {
        console.log(error);
      });




  }, []);

  return (
    
    <Box sx={{ flexGrow: 1, mt: 12,ml: 0 }} >
     
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

            <Grid item xs={6}>
              <Button variant="contained" style={{maxWidth: '150px', minWidth: '150px'}} startIcon={<CheckCircleOutlineIcon />} disabled={btnDisabled} onClick={handleCompleteReading}>{readingButtonText}</Button>
            </Grid>

            <Grid item xs={6}>
              <Button variant="contained" style={{maxWidth: '150px', minWidth: '150px'}} startIcon={<LibraryAddIcon />} onClick={handleAddCollection}>Collection</Button>
            </Grid>
            <Grid item xs={6}>
              <Rating
                name="simple-controlled"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                  handleSubmitRating(newValue);
                }}
              />
            </Grid>
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
                      precision={0.01}
                      size="small"
                      disabled
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
                <Grid item xs={2}>
                  <Box sx={{ flexGrow: 1, mt: 1}}>
                    <Rating
                      name="simple-controlled"
                      value={rating}
                      onChange={(event, newValue) => {
                        setRating(newValue);
                        handleSubmitRating(newValue);
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  {reviewButtonshow &&
                  <Button startIcon={<DriveFileRenameOutlineIcon />} onClick={() => handleAddReview()}>Add Review</Button>}
                </Grid>
              </Grid>
            </Grid>



            <Grid item xs={12}>
            {reviews.length == 0 &&  <Typography variant="h6" gutterBottom component="div">No reviews yet</Typography>}
              {reviews.length > 0 &&  reviews.map((item, i) => 
              <Grid container direction="row" spacing={2}>

                <Grid item xs={1}>
                  <Box
                    component="img"
                    sx={{
                      height: 50,
                      my:1
                    }}
                    alt="avatar"
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  />
                </Grid>
                <Grid item xs={11}>
                  <Grid container direction="row" spacing={0}>
                    <Grid item xs={1}>
                      <Typography variant="subtitle2" style={{ fontWeight: 600 }} display="block" gutterBottom> {item['username']} </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" style={{ fontWeight: 600 }} display="block" gutterBottom> {item['time'].split(".")[0]} </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Rating
                        size="small"
                        value={item['rating']}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <Typography variant="body2" display="block" gutterBottom>
                        {item['content']}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

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
            <Grid item xs={3}>
              <Box
                component="img"
                sx={{
                  width: 100,
                  ml: 0
                }}
                alt="book cover"
                src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1586722975l/2767052.jpg"
              />
              <Typography variant="body2" display="block" gutterBottom>
                Harry potter
              </Typography>

            </Grid>
            <Grid item xs={3}>
              <Box
                component="img"
                sx={{
                  width: 100,
                  my:0
                }}
                alt="book cover"
                src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1586722975l/2767052.jpg"
              />
              <Typography variant="body2" display="block" gutterBottom>
                Harry potter
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Box
                component="img"
                sx={{
                  width: 100,
                  my:0
                }}
                alt="book cover"
                src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1586722975l/2767052.jpg"
              />
              <Typography variant="body2" display="block" gutterBottom>
                Harry potter
              </Typography>
            </Grid>

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
                setRating(newValue);
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
    </Box>


  );
};
export default BookDetail;