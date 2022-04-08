import React, { useState, useEffect } from 'react';
import {Box, Grid} from '@material-ui/core';
import Button from '@mui/material/Button';
import './Home.css';
import Card from '@material-ui/core/Card'
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';
import axios from "axios";
import {url} from "../../components/Helper";
import {useNavigate} from 'react-router-dom';
import BookSection from "../SearchBooks/BookSection";
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

const data = {
  bookTitle: 'Harry Potter',
  bookAuthor: 'J.K.Rowling',
  bookRating: '4.5',
  likeAuthor: 'J.K.Rowling',
  likeSubject: 'Science Fiction'
}

const Home = ({ifLogin, updateSearchResult, updateSearchType, updateSearchGenres, updatePageCount, updatePage, updateGenreRating}) => {
  const navigate = useNavigate();
  const [topBooks, setTopBooks] = useState([]);
  const [highRating, setHighRating] = useState([]);
  const [favAuthor, setFavAuthor] = useState({});
  const [favGenre, setFavGenre] = useState({});
  const [followingFav, setFollowingFav] = useState({});

  useEffect(async () => {
    axios.get(`${url}/recommendation/toprating`)
      .then(res => {
        setTopBooks(res.data.books);
      })
      .catch(error => {
        alert(error.message);
      })

    axios.get(`${url}/recommendation/highrating`)
      .then(res => {
        setHighRating(res.data.books);
      })

    if (ifLogin) {
      axios.get(`${url}/recommendation/favouriteAuthor`, {
        params: {
          token: localStorage.getItem('token')
        }
      })
        .then(res => {
          setFavAuthor(res.data);
        })

      axios.get(`${url}/recommendation/favouriteGenre`, {
        params: {
          token: localStorage.getItem('token')
        }
      })
        .then(res => {
          setFavGenre(res.data);
        })

      axios.get(`${url}/recommendation/favouritefollowings`, {
        params: {
          token: localStorage.getItem('token')
        }
      })
        .then(res => {
          setFollowingFav(res.data.books);
        })
    }
  }, [])

  const Recommendations = () => {
    const getAuthorBooks = () => {

    }

    const getGenreBooks = () => {

    }

    const getFollowingBooks = () => {

    }

    return (
      <>
        <h1>Recommendations</h1>
        {ifLogin ?
          <div className='flex-container'>
            <Button variant="outlined" onClick={getAuthorBooks}>{favAuthor.author}</Button>
            <Button variant="outlined" color='success' onClick={getGenreBooks}>{favGenre.genre}</Button>
            <Button variant="outlined" color='warning' onClick={getFollowingBooks}>Your followings' favourite</Button>
          </div> : null
        }
        <div className='flex-container'>
          <Button variant="outlined" color='error'>4-5 star rating</Button>
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
          alert(error.message);
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
                  // src={`${item.img}?w=248&fit=crop&auto=format`}
                  src={item.img}
                  // srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.title}
                  loading="lazy"
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
          justifyContent="center"
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
      {ifLogin ?
      <div className='space'>
        <Recommendations/>
      </div> : null
      }
      <div className='space'>
        <Subjects/>
      </div>
      <TopBooks/>
    </>
  );
};
export default Home;