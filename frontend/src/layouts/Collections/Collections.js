<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
=======
import React, { useState, useRef } from 'react';
>>>>>>> new-db
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
<<<<<<< HEAD
import { url } from '../../components/Helper';
=======
>>>>>>> new-db

import {
  Box,
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography
} from "@material-ui/core";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Card from "@material-ui/core/Card";
<<<<<<< HEAD
import axios from "axios";
import {Link} from "react-router-dom";


const Collections = ({userInfo}) => {
  const [collections, setCollections] = useState([]);
  let initialCollections = [];
  const [open, setOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState({
    collection_id: '',
    name: '',
    books: []
  });
  let newCollection = '';   // the name of created collection

  useEffect(async () => {
    axios.get(`${url}/collection/getall`, {params: {
        user: userInfo.username
      }})
      .then(res => {
        setCollections([...res['data']['collections']]);
        initialCollections = [...res['data']['collections']]
        // default show Favourite Collection
        getCollection(getFavouriteCollectionIdByFlag());
      })
      .catch(function (error) {
        alert("error")
        // alert(error.response.data.message);
      });
  }, [])

  // get favourite collection id by flag
  const getFavouriteCollectionIdByFlag = () => {
    for (let collection of initialCollections) {
      if (collection['flag'] === 1) {
        return collection.id
      }

    }
  }

  // show books when click a specific collection
  const getCollection = (collection_id) => {
    axios.get(`${url}/collection/getcollection`, {params: {
        collection_id: collection_id
      }})
      .then(res => {
        setCurrentCollection({
          collection_id: collection_id,
          name: res.data.name,
          books: res.data.books
        })
      })
      .catch(function (error) {
        alert(error.response.data.message);
      });
  }


  const Sidebar = () => {

    // for create collection dialog
    const handleChange = (event) => {
      newCollection = event.target.value;
    }

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };
    ////////////////////////////////
    // create a new collection
    const createCollection = () => {

      // if (collections.filter((collection) => collection.name === newCollection) !== []) {
      //   alert("Cannot have duplicate collection name");
      //   return;
      // }

      axios.post(`${url}/collection/create`, {
        email: userInfo.email,
        name: newCollection,
        token: localStorage.getItem('token')
      }).then(res => {
        const created = {
          id: res['data']["id"],
          name: newCollection,
          flag: 3
        }
        const newCollections = [...collections];
        setCollections([...newCollections, created]);
        handleClose();
      })
        .catch(function (error) {
          alert(error.response.data.message);
        });
    }

=======


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

const collection3 = {
  collectionName: 'new',
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

const Collections = () => {
  const [collections, setCollections] = useState(['Favourite', 'Complete']);
  const [open, setOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(collection1);
  let newCollection = '';

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCollection = (collectionName) => {
    if (collectionName === 'Favourite')
      setCurrentCollection(collection1);
    else if (collectionName === 'Complete')
      setCurrentCollection(collection2);
    else
      setCurrentCollection(collection3);
  }

  const removeBook = (title) => {
    const newBooks = currentCollection.books.filter((book) => book.title !== title);
    const newCollection = {
      collectionName: currentCollection.collectionName,
      books: newBooks
    }
    setCurrentCollection(newCollection);
  }

  const removeCollection = () => {
    const newCollections = collections.filter((collection) => collection !== currentCollection.collectionName);
    setCollections(newCollections);
    setCurrentCollection(collection1);
  }

  const createCollection = () => {
    const newCollections = [...collections];
    newCollections.push(newCollection);
    setCollections(newCollections);
    handleClose();
  }

  const handleChange = (event) => {
    newCollection = event.target.value;
  }

  const Sidebar = () => {
>>>>>>> new-db
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
                id="new name"
                label="Collection Name"
                onChange={handleChange}
                type="text"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <button onClick={handleClose}>Cancel</button>
              <button onClick={createCollection}>Create Collection</button>
            </DialogActions>
          </Dialog>
          <Divider />
<<<<<<< HEAD
          {collections.map((collection) => {
            return (
              <MenuItem
                key={collection.id}
                onClick={() => getCollection(collection.id)}
              >
                <ListItemText>{collection.name}</ListItemText>
=======
          {collections.map((collection, idx) => {
            return (
              <MenuItem
                key={idx}
                onClick={() => getCollection(collection)}
              >
                <ListItemText>{collection}</ListItemText>
>>>>>>> new-db
              </MenuItem>
            )
          })}
        </MenuList>
      </Paper>
    )
  }

  const CollectionBar = () => {
<<<<<<< HEAD

    const removeCollection = () => {

      axios.delete(`${url}/collection/removecollection`, {data: {
          email: userInfo.email,
          collection_id: currentCollection.collection_id
        }
      })
        .then(res => {
          const newCollections = collections.filter((collection) => collection.id !== currentCollection.collection_id);
          setCollections([...newCollections]);
          // automatically show Favourite Collection after removing a collection
          let fav = -1;
          for (let collection of collections) {
            if (collection['flag'] === 1) {
              fav = collection.id;
            }
          }
          getCollection(fav);
        })
    }

    return (
      <Box sx={{display: 'flex'}}>
        <h1>{currentCollection.name}</h1>
        {currentCollection.name === 'Favourite' || currentCollection.name === 'Reading History' ?
=======
    return (
      <Box sx={{display: 'flex'}}>
        <h1>{currentCollection.collectionName}</h1>
        {currentCollection.collectionName === 'Favourite' || currentCollection.collectionName === 'Complete' ?
>>>>>>> new-db
          null :
          <div>
            <button>Edit Name</button>
            <button onClick={removeCollection}>Remove</button>
          </div>
        }
      </Box>
    )
  }

<<<<<<< HEAD
  const Book = ({id, title, author, cover}) => {

    const removeBook = () => {

      axios.delete(`${url}/collection/removebook`, {data: {
          email: userInfo.email,
          collection_id: currentCollection.collection_id,
          book_id: id
        }
      }).then(res => {
        const newBooks = currentCollection.books.filter((book) => book.title !== title);
        const newCollection = {
          collection_id: currentCollection.collection_id,
          name: currentCollection.name,
          books: newBooks
        }
        setCurrentCollection(newCollection);
      })
        .catch(error => {
          alert(error.response.data.message);
        });
    }

    return (
      <>
        <Card sx={{maxWidth: 345}} component={Link} to={`/book/${id}`}>
=======
  const Book = ({title, author, cover}) => {
    return (
      <>
        <Card sx={{maxWidth: 345}}>
>>>>>>> new-db
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
<<<<<<< HEAD
        <button onClick={removeBook}>Remove</button>
=======
        <button onClick={()=>removeBook(title)}>Remove</button>
>>>>>>> new-db
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
<<<<<<< HEAD
          {currentCollection.books.map((book) => {
            return (
              <Grid item xs={12} sm={6} md={2} key={book.id}>
                <Book id={book.id} title={book.title} author={book.author} cover={book.cover}/>
=======
          {currentCollection.books.map((book, idx) => {
            return (
              <Grid item xs={12} sm={6} md={2} key={idx}>
                <Book title={book.title} author={book.author} cover={book.cover}/>
>>>>>>> new-db
              </Grid>
            )
          })}
        </Grid>
      </Paper>
    )
  }

<<<<<<< HEAD
=======


>>>>>>> new-db
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