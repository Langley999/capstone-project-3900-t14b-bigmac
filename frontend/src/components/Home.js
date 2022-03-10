import React, { useState, useRef } from 'react';
import { Grid } from '@material-ui/core';
import Button from '@mui/material/Button';
import './Home.css';
import Card from '@material-ui/core/Card'
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';

const Home = ({ifLogin}) => {
  const data = {
    bookTitle: 'Harry Potter',
    bookAuthor: 'J.K.Rowling',
    bookRating: '4.5',
    likeAuthor: 'J.K.Rowling',
    likeSubject: 'Science Fiction'
  }

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

    const itemData = [
      {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Science Fiction',
      },
      {
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Human Alien Encounters',
      },
      {
        img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        title: 'Adventure Stories',
      },
      {
        img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
        title: 'Fiction',
      },
      {
        img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
        title: 'Young Adult',
      },
      {
        img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
        title: 'Romance',
      },
      {
        img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        title: 'Frontier',
      },
      {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        title: 'Love Stories',
      },
      {
        img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
        title: 'Historical Fiction',
      },
      {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        title: 'Dystopias',
      },
      {
        img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
        title: 'Thrillers&Suspense',
      },
      {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        title: 'Time Travel',
      },
    ];

    return (
      <>
        <h1>Popular Subjects</h1>
        <div className='subjects-container'>
          {itemData.map((item) => (
            <div className='img-container'>
              <ImageListItem key={item.img}>
                <img
                  src={`${item.img}?w=248&fit=crop&auto=format`}
                  srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
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

  const BookCard = () => {
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image='https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'
            alt="book card"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data.bookTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.bookAuthor}
            </Typography>
            <Typography variant="body2">
              {data.bookRating}
            </Typography>
          </CardContent>
        </CardActionArea>

      </Card>
    )
  }

  const TopBooks = () => {

    return (
      <>
        <h1>Top 10 Books</h1>
        <Grid
          container
          spacing={3}
          justifyContent="centre"
        >
          <Grid item xs={12} sm={6} md={3}>
            <BookCard />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <BookCard />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <BookCard />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <BookCard />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <BookCard />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <BookCard />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <BookCard />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <BookCard />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <BookCard />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <BookCard />
          </Grid>
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