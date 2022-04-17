import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Grid} from '@material-ui/core';
import BookSection from './SearchBooks/BookSection';
import Box from '@mui/material/Box';
import {Divider, Pagination} from '@mui/material';
import {url} from '../components/Helper';
import ErrorPopup from '../components/ErrorPopup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';


/**
 * Showing the recommendations
 */
const Recommendations = ({searchType}) => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const [favAuthors, setFavAuthors] = useState([]);
  const [favGenres, setFavGenres] = useState([]);
  const [radioAuthor, setRadioAuthor] = useState('');
  const [radioGenre, setRadioGenre] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [followingLikes, setFollowingLikes] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const pageSize = 12;

  useEffect(async () => {
    if (searchType === 'byFavAuthor') {
      axios.get(`${url}/recommendation/favouriteAuthor`, {
        params: {
          token: localStorage.getItem('token')
        }
      })
        .then(res => {
          setFavAuthors(res.data.favourite_authors);

          setRadioAuthor(res.data.favourite_authors[0]);

          axios.get(`${url}/search/searchbook`, {params: {
              type: 'author',
              value: res.data.favourite_authors[0],
              rating: 0,
              page: 1
            }})
            .then(res => {
              setPage(1);
              setPageCount(res.data.pages);
              setRecommendations(res.data.books);
            })
        })
    } else if (searchType === 'byFavGenre') {
      axios.get(`${url}/recommendation/favouriteGenre`, {
        params: {
          token: localStorage.getItem('token')
        }
      })
        .then(res => {
          setFavGenres(res.data.favourite_genres);

          setRadioGenre(res.data.favourite_genres[0]);

          axios.get(`${url}/search/genre`, {params: {
              genres: res.data.favourite_genres[0],
              rating: 0,
              page: 1
            }})
            .then(res => {
              setPage(1);
              setPageCount(res.data.pages);
              setRecommendations(res.data.books);
            })
        })
    } else if (searchType === 'byFollowing') {

      axios.get(`${url}/recommendation/favouriteFollowed`, {
        params: {
          token: localStorage.getItem('token')
        }
      })
        .then(res => {
          setFollowingLikes(res.data.favourite_followed_books);
          setPageCount(Math.ceil(res.data.favourite_followed_books.length / pageSize));
          changePageHelper(1, res.data.favourite_followed_books);
        })
    } else {
      axios.get(`${url}/search/searchbook`, {params: {
          type: 'title',
          value: '',
          rating: 4,
          page: 1
        }})
        .then(res => {
          setPage(1);
          setPageCount(res.data.pages);
          setRecommendations(res.data.books);
        })
    }
  }, []);

  const onChangeRadioAuthor = (e) => {
    setRadioAuthor(e.target.value);

    axios.get(`${url}/search/searchbook`, {params: {
        type: 'author',
        value: e.target.value,
        rating: 0,
        page: 1
      }})
      .then(res => {
        setPage(1);
        setPageCount(res.data.pages);
        setRecommendations(res.data.books);
      })
  }

  const onChangeRadioGenre = (e) => {
    setRadioGenre(e.target.value);

    axios.get(`${url}/search/genre`, {params: {
        genres: e.target.value,
        rating: 0,
        page: 1
      }})
      .then(res => {
        setPage(1);
        setPageCount(res.data.pages);
        setRecommendations(res.data.books);
      })
      .catch(function (error) {
        alert(error.message);
      });
  }

  const changePageHelper = (value, array) => {
    const start = (value-1)*pageSize;
    const end = value * pageSize;
    setRecommendations(array.slice(start, end));
  }

  const handleChangePage = (event, value) => {
    setPage(value);
    if (searchType === 'byFavAuthor') {
      axios.get(`${url}/search/searchbook`, {
        params: {
          type: 'author',
          value: radioAuthor,
          rating: 0,
          page: value
        }
      })
        .then(res => {
          setRecommendations(res.data.books);
        })
        .catch(function (error) {
          setErrorMsg(error.response.data.message);
          setShowError(true);
        });
    } else if (searchType === 'byFavGenre') {
      axios.get(`${url}/search/genre`, {params: {
          genres: radioGenre,
          rating: 0,
          page: value
        }})
        .then(res => {
          setRecommendations(res.data.books);
        })
        .catch(function (error) {
          setErrorMsg(error.response.data.message);
          setShowError(true);
        });
    } else if (searchType === 'byFollowing'){
      changePageHelper(value, followingLikes);
    } else {
      axios.get(`${url}/search/searchbook`, {
        params: {
          type: 'title',
          value: '',
          rating: 4,
          page: value
        }
      })
        .then(res => {
          setRecommendations(res.data.books);
        })
        .catch(function (error) {
          setErrorMsg(error.response.data.message);
          setShowError(true);
        });
    }
  }

  const RecommendationTitle = () => {
    if (searchType === 'byFavAuthor')
      return <h2>Recommendations Based On Favourite Authors</h2>;
    else if (searchType === 'byFavGenre')
      return <h2>Recommendations Based On Favourite Genres</h2>;
    else if (searchType === 'byFollowing')
      return <h2>Recommendations Based On Followings' Favourite</h2>;
    else
      return <h2>Recommendations Based On High Rating Books</h2>;
  }

  return (
    <>
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError} />
      <RecommendationTitle/>
      {searchType === 'byFavAuthor' ?
        <>
          <RadioGroup
            aria-labelledby='radio-buttons-authors'
            name='radio-buttons-authors'
            value={radioAuthor}
            onChange={onChangeRadioAuthor}
          >
            <Grid
              container
              spacing={3}
              justifyContent='center'
            >
              {favAuthors.map((author) => {
                return (
                  <FormControlLabel value={author} control={<Radio/>} label={author}/>
                )
              })}
            </Grid>
          </RadioGroup>
          <Divider sx={{marginTop: '15px'}}/>
        </>
        : null
      }
      {searchType === 'byFavGenre' ?
        <>
          <RadioGroup
            aria-labelledby='radio-buttons-genre'
            name='radio-buttons-genre'
            value={radioGenre}
            onChange={onChangeRadioGenre}
          >
            <Grid
              container
              spacing={3}
              justifyContent='center'
            >
              {favGenres.map((genre) => {
                return (
                  <FormControlLabel value={genre} control={<Radio/>} label={genre}/>
                )
              })}
            </Grid>
          </RadioGroup>
          <Divider sx={{marginTop: '15px'}}/>
        </>
        : null
      }
      <Box sx={{marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {recommendations.length > 0 ?
          <>
            <Grid
              container
              spacing={3}
              justifyContent='center'
            >
              {recommendations.map((bookInfo) => {
                return (
                  <Grid item xs={12} sm={6} md={4} key={bookInfo.id}>
                    <BookSection bookInfo={bookInfo}/>
                  </Grid>
                )
              })}
            </Grid>
            <Pagination sx={{marginBottom: '20px', marginTop: '30px'}} count={pageCount} page={page}
                        onChange={handleChangePage}
            />
          </>
          : <div style={{paddingTop: '50px'}}>Loading...</div>
        }
      </Box>
    </>
  );
};
export default Recommendations;