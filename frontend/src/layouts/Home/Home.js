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

const Home = ({ifLogin, updateSearchResult}) => {
  const navigate = useNavigate();
  const [topBooks, setTopBooks] = useState([]);

  useEffect(async () => {
    axios.get(`${url}/recommendation/toprating`)
      .then(res => {
        setTopBooks(res.data.books);
      })
      .catch(error => {
        alert(error.message);
      })
  }, [])

  const Recommendations = () => {

    return (
      <>
        <h1>Recommendations</h1>
        <div className='flex-container'>
          <Button variant="outlined">{data.likeAuthor}</Button>
          <Button variant="outlined" color='success'>{data.likeSubject}</Button>
        </div>
        <div className='flex-container'>
          <Button variant="outlined" color='error'>4-5 star rating</Button>
          <Button variant="outlined" color='warning'>Guess you like...</Button>
          <Button variant="outlined" color='secondary'>Most Popular</Button>
        </div>
      </>
    )
  }

  const Subjects = () => {
    const searchGenre = (genres) => {
      axios.get(`${url}/search/genre`, {params: {
          genres: genres,
          rating: 0
        }})
        .then(res => {
          updateSearchResult(res.data.books);
          navigate('searchbooks');
        })
        .catch(function (error) {
          alert(error.response.data.message);
        });
    }

    return (
      <>
        <h1>Popular Genres</h1>
        <div className='subjects-container'>
          {itemData.map((item, idx) => (
            <Box
              sx={{cursor: 'pointer'}}
              className='img-container'
              key={idx}
              onClick={() => searchGenre(item.title)}
            >
              <ImageListItem>
                <img
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
            </Box>
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