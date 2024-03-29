import React, { useState, useEffect } from 'react';
import {Grid} from '@material-ui/core';
import Button from '@mui/material/Button';
import './Home.css';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
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
import WarningPopup from '../../components/WarningPopup';
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
const Home = ({ifLogin, updateSearchResult, updateSearchType, updateSearchGenres, updatePageCount, updatePage, updateGenreRating, updateFollowingFav, followingFav}) => {
  const navigate = useNavigate();
  const [topBooks, setTopBooks] = useState([]);
  const [favAuthors, setFavAuthors] = useState([]);
  const [favGenres, setFavGenres] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(async () => {
    axios.get(`${url}/recommendation/toprating`)
      .then(res => {
        setTopBooks(res.data.books);
      })
      .catch(error => {
        setErrorMsg(error.message);
        setShowError(true);
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
        setErrorMsg("Please add books to your collection");
        setShowWarning(true);
        return;
      }

      updateSearchType('byFavAuthor');
      navigate('recommendations');
    }

    const getFavGenres = () => {
      if (favGenres[0] === 'Find More Genres') {
        setErrorMsg("Please add books to your collection");
        setShowWarning(true);
        return;
      }

      updateSearchType('byFavGenre');
      navigate('recommendations');
    }

    const getFollowingBooks = () => {
      if (followingFav.length === 0) {
        setErrorMsg("Please follow some users");
        setShowWarning(true);
        return;
      }

      updateSearchType('byFollowing');
      navigate('recommendations');
    }

    const getHighRating = () => {
      updateSearchType('byHighRating');
      navigate('recommendations');
    }

    return (
      <>
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
          setErrorMsg(error.message);
          setShowError(true);
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
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError} />
      <WarningPopup warningMsg={errorMsg} snackBarOpen={showWarning} setSnackBarOpen={setShowWarning} />
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