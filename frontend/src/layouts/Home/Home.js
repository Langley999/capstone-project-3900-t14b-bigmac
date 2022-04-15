import React, { useState, useEffect } from 'react';
import {Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from '@material-ui/core';
import Button from '@mui/material/Button';
import './Home.css';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import {ListItemText, MenuItem, MenuList} from '@mui/material';
import axios from 'axios';
import {url} from '../../components/Helper';
import {useNavigate} from 'react-router-dom';
import BookSection from '../SearchBooks/BookSection';
import adult from '../../assets/adult.jpeg';
import audiobook from '../../assets/audiobooks.png';
import classics from '../../assets/classics.jpeg';
import contemporary from '../../assets/contemporary.jpeg';
import fantasy from '../../assets/fantasy.jpeg';
import fiction from '../../assets/fiction.jpeg';
import historical from '../../assets/historical fiction.jpeg';
import mystery from '../../assets/mystery.jpeg';
import nonfiction from '../../assets/nonfiction.webp';
import novels from '../../assets/novels.jpeg';
import romance from '../../assets/romance.jpeg';
import youngAdult from '../../assets/young adult.jpeg';
import ErrorPopup from '../../components/ErrorPopup';

const itemData = [
  {
    img: fiction,
    title: 'Fiction',
  },
  {
    img: romance,
    title: 'Romance',
  },
  {
    img: fantasy,
    title: 'Fantasy',
  },
  {
    img: youngAdult,
    title: 'Young Adult',
  },
  {
    img: contemporary,
    title: 'Contemporary',
  },
  {
    img: nonfiction,
    title: 'Nonfiction',
  },
  {
    img: adult,
    title: 'Adult',
  },
  {
    img: novels,
    title: 'Novels',
  },
  {
    img: mystery,
    title: 'Mystery',
  },
  {
    img: historical,
    title: 'Historical Fiction',
  },
  {
    img: audiobook,
    title: 'Audiobook',
  },
  {
    img: classics,
    title: 'Classics',
  },
];

/**
 * Home page for BookStation
 */
const Home = ({ifLogin, updateSearchResult, updateSearchType, updateSearchGenres, updatePageCount, updatePage, updateGenreRating, updateTempsearchRating, updateSearchValue, updateRadioValue, updateFollowingFav, followingFav}) => {
  const [warningopen, setwarningopen] = useState(false);
  const [warningcontent, setwarningcontent] = useState('');
  const navigate = useNavigate();
  const [topBooks, setTopBooks] = useState([]);
  const [favAuthors, setFavAuthors] = useState([]);
  const [favGenres, setFavGenres] = useState([]);
  const [openAuthors, setOpenAuthors] = useState(false);
  const [openGenres, setOpenGenres] = useState(false);
  const pageSize = 12;

  useEffect(async () => {
    axios.get(`${url}/recommendation/toprating`)
      .then(res => {
        setTopBooks(res.data.books);
      })
      .catch(error => {
        setwarningopen(true);
        setwarningcontent(error.message);
      })

    if (ifLogin) {
      axios.get(`${url}/recommendation/favouriteAuthor`, {
        params: {
          token: localStorage.getItem('token')
        }
      })
        .then(res => {
          if (res.data.favourite_authors.length > 0)
            setFavAuthors(res.data.favourite_authors);
          else
            setFavAuthors(['Find More Authors']);
        })

      axios.get(`${url}/recommendation/favouriteGenre`, {
        params: {
          token: localStorage.getItem('token')
        }
      })
        .then(res => {
          if (res.data.favourite_genres.length > 0)
            setFavGenres(res.data.favourite_genres);
          else
            setFavGenres(['Find More Genres']);
        })

      axios.get(`${url}/recommendation/favouriteFollowed`, {
        params: {
          token: localStorage.getItem('token')
        }
      })
        .then(res => {
          updateFollowingFav(res.data.favourite_followed_books);
        })
    }
  }, []);

  const Recommendations = () => {
    const getFavAuthors = () => {
      if (favAuthors[0] === 'Find More Authors') {
        alert('Please add books to your collection');
        return;
      }

      setOpenAuthors(true);
    }

    const getAuthorBooks = (author) => {
      axios.get(`${url}/search/searchbook`, {params: {
          type: 'author',
          value: author,
          rating: 0,
          page: 1
        }})
        .then(res => {
          updateSearchValue(author);
          updateRadioValue('author');
          updatePage(1);
          updateTempsearchRating(0);
          updateSearchType('byValue');
          updatePageCount(res.data.pages);
          updateSearchResult(res.data.books);
          handleCloseAuthors();
          navigate('searchbooks');
        })
    }

    const getFavGenres = () => {
      if (favGenres[0] === 'Find More Genres') {
        alert('Please add books to your collection');
        return;
      }

      setOpenGenres(true);
    }

    const getGenreBooks = (genre) => {
      axios.get(`${url}/search/genre`, {params: {
          genres: genre,
          rating: 0,
          page: 1
        }})
        .then(res => {
          updateGenreRating(0);
          updateSearchGenres(genre);
          updateSearchType('byGenre');
          updatePage(1);
          updatePageCount(res.data.pages);
          updateSearchResult(res.data.books);
          handleCloseGenres();
          navigate('searchbooks');
        })
        .catch(function (error) {
          setwarningopen(true);
          setwarningcontent(error.message);
        });
    }

    const getFollowingBooks = () => {
      if (followingFav.length === 0) {
        alert('Please follow some users');
        return;
      }
      updateSearchResult(followingFav.slice(0, pageSize));
      updatePage(1);
      updatePageCount(Math.ceil(followingFav.length / pageSize));
      updateSearchType('byRecommendation');
      navigate('searchbooks');
    }

    const getHighRating = () => {
      axios.get(`${url}/search/searchbook`, {params: {
          type: 'title',
          value: '',
          rating: 4,
          page: 1
        }})
        .then(res => {
          updateSearchValue('');
          updateRadioValue('title');
          updatePage(1);
          updateTempsearchRating(4);
          updateSearchType('byValue');
          updatePageCount(res.data.pages);
          updateSearchResult(res.data.books);
          navigate('searchbooks');
        })
    }

    const handleCloseAuthors = () => {
      setOpenAuthors(false);
    }

    const handleCloseGenres = () => {
      setOpenGenres(false);
    }

    return (
      <>
        <Dialog
          open={openAuthors}
          onClose={handleCloseAuthors}
          sx={{
            height: '367px',
            width: '240px',
            overflow: 'auto'
          }}
        >
          <DialogTitle>Favourite Authors</DialogTitle>
          <DialogContent>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <MenuList>
                {favAuthors.map((author) => {
                  return (
                    <MenuItem key={author}>
                      <ListItemText onClick={() => getAuthorBooks(author)}>{author}</ListItemText>
                    </MenuItem>
                  )
                })}
              </MenuList>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant='outlined'
              onClick={handleCloseAuthors}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openGenres}
          onClose={handleCloseGenres}
          sx={{
            height: '367px',
            width: '240px',
            overflow: 'auto'
          }}
        >
          <DialogTitle>Favourite Genres</DialogTitle>
          <DialogContent>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <MenuList>
                {favGenres.map((genre) => {
                  return (
                    <MenuItem key={genre}>
                      <ListItemText onClick={() => getGenreBooks(genre)}>{genre}</ListItemText>
                    </MenuItem>
                  )
                })}
              </MenuList>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant='outlined'
              onClick={handleCloseGenres}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <h1>Recommendations</h1>
        {ifLogin ?
          <div className='flex-container'>
            <Button variant='outlined' onClick={getFavAuthors}>Favourite Authors</Button>
            <Button variant='outlined' color='success' onClick={getFavGenres}>Favourite Genres</Button>
            <Button variant='outlined' color='warning' onClick={getFollowingBooks}>Your followings' favourite</Button>
          </div> : null
        }
        <div className='flex-container'>
          <Button variant='outlined' color='error' onClick={getHighRating}>4-5 star rating</Button>
        </div>
      </>
    )
  }

  const Subjects = () => {
    const searchGenre = (genres) => {
      axios.get(`${url}/search/genre`, {params: {
          genres: genres,
          rating: 0,
          page: 1
        }})
        .then(res => {
          updateGenreRating(0);
          updateSearchGenres(genres);
          updateSearchType('byGenre');
          updatePage(1);
          updatePageCount(res.data.pages);
          updateSearchResult(res.data.books);
          navigate('searchbooks');
        })
        .catch(function (error) {
          setwarningopen(true);
          setwarningcontent(error.message);
        });
    }

    return (
      <>
        <h1>Popular Genres</h1>
        <div className='subjects-container'>
          {itemData.map((item, idx) => (
            <div
              style={{cursor: 'pointer'}}
              className='img-container'
              key={idx}
              onClick={() => searchGenre(item.title)}
            >
              <ImageListItem>
                <img
                  className='picture'
                  src={item.img}
                  alt={item.title}
                  loading='lazy'
                />

                <ImageListItemBar
                  title={item.title}
                />
              </ImageListItem>
            </div>
          ))}
        </div>
      </>
    );
  }

  const TopBooks = () => {

    return (
      <>
        <h1>Top 20 Books</h1>
        <Grid
          container
          spacing={3}
          justifyContent='center'
        >
          {topBooks.map((bookInfo) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={bookInfo.id}>
                <BookSection bookInfo={bookInfo}/>
              </Grid>
            )
          })}
        </Grid>
      </>
    )
  }


  return (
    <>
      <ErrorPopup errorMsg={warningcontent} snackBarOpen={warningopen} setSnackBarOpen={setwarningopen}/>
      <div className='space'>
        <Recommendations/>
      </div>
      <div className='space'>
        <Subjects/>
      </div>
      <TopBooks/>
    </>
  );
};
export default Home;