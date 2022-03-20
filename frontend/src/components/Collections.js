<<<<<<< HEAD
import React, { useState } from 'react';
<<<<<<< HEAD
import '../App.css';


=======
>>>>>>> update profile
=======
import React, { useState, useRef } from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import CardActions from '@mui/material/CardActions';
import {
  Box,
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography
} from "@material-ui/core";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Card from "@material-ui/core/Card";
>>>>>>> update collections


const Collections = () => {
  const [open, setOpen] = React.useState(false);
  const [newCollection, setNewCollection] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const collections = ['Favourite', 'Complete'];
  const collection1 = {
    collectionName: 'Favourite',
    books: [
      {
        title: 'book1',
        author: 'auth1',
        cover: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6'
      },
      {
        title: 'book2',
        author: 'auth2',
        cover: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6'
      },
      {
        title: 'book3',
        author: 'auth1',
        cover: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6'
      },
      {
        title: 'book4',
        author: 'auth2',
        cover: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6'
      },
      {
        title: 'book5',
        author: 'auth1',
        cover: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6'
      },
      {
        title: 'book6',
        author: 'auth2',
        cover: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6'
      },
      {
        title: 'book7',
        author: 'auth1',
        cover: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6'
      },
      {
        title: 'book8',
        author: 'auth2',
        cover: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6'
      }
    ]
  }
  const collection2 = {
    collectionName: 'Complete',
    books: [
      {
        title: 'book3',
        author: 'auth3',
        cover: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6'
      },
      {
        title: 'book4',
        author: 'auth4',
        cover: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6'
      }
    ]
  }
  const [currentCollection, setCurrentCollection] = useState(collection1);

  const getCollection = (collectionName) => {
    if (collectionName === 'Favourite')
      setCurrentCollection(collection1);
    else
      setCurrentCollection(collection2);
  }

  const removeBook = (title) => {
    const newBooks = currentCollection.books.filter((book) => book.title !== title);
    const newCollection = {
      collectionName: currentCollection.collectionName,
      books: newBooks
    }
    setCurrentCollection(newCollection);
  }

  const createCollection = () => {

  }

  const Sidebar = () => {
    return (
      <Paper sx={{ width: 200, maxWidth: '100%', height: 500, overflow: 'auto'}}>
        <MenuList>
          <MenuItem>
            <ListItemText onClick={handleClickOpen}>+ Add Collection</ListItemText>
          </MenuItem>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Collection Name"
                value={}
                type="text"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <button onClick={handleClose}>Cancel</button>
              <button onClick={handleClose}>Create Collection</button>
            </DialogActions>
          </Dialog>
          <Divider />
          {collections.map((collection, idx) => {
            return (
              <MenuItem
                key={idx}
                onClick={() => getCollection(collection)}
              >
                <ListItemText>{collection}</ListItemText>
              </MenuItem>
            )
          })}
        </MenuList>
      </Paper>
    )
  }

  const CollectionBar = () => {
    return (
      <Box sx={{display: 'flex'}}>
        <h1>{currentCollection.collectionName}</h1>
        {currentCollection.collectionName === 'Favourite' || currentCollection.collectionName === 'Complete' ?
          null :
          <div>
            <button>Edit Name</button>
            <button>Remove</button>
          </div>
        }
      </Box>
    )
  }

  const Book = ({title, author, cover}) => {
    return (
      <>
        <Card sx={{maxWidth: 345}}>
          <CardMedia
            component="img"
            height="140"
            image={cover}
            alt="book card"
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="body2">
              {author}
            </Typography>
          </CardContent>
        </Card>
        <button onClick={()=>removeBook(title)}>Remove</button>
      </>
    )
  }

  const Books = () => {
    return (
      <Paper sx={{
        width: '100%',
        height: '500px',
        marginLeft: '40px',
        padding: '20px',
        overflow: 'auto'
      }}>
        <CollectionBar/>
        <Divider sx={{marginTop: '10px', marginBottom: '10px'}}/>
        <Grid
          container
          spacing={3}
        >
          {currentCollection.books.map((book, idx) => {
            return (
              <Grid item xs={12} sm={6} md={2} key={idx}>
                <Book title={book.title} author={book.author} cover={book.cover}/>
              </Grid>
            )
          })}
        </Grid>
      </Paper>
    )
  }



  return (
    <>
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Sidebar/>
        <Books/>
      </Box>
    </>
  );
};
export default Collections;