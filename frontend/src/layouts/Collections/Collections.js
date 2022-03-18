import React, { useState, useRef, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { url } from '../../components/Helper';
import '../../App.css';

import Button from '@mui/material/Button';
import {
  Box,
  CardActionArea,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography
} from "@material-ui/core";
import CardContent from "@mui/material/CardContent";
import Card from "@material-ui/core/Card";
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
        console.log(res['data']['collections']);
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
    if (collection_id) {
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
                fullWidth
                label="Collection Name"
                name="collectionName"
                onChange={handleChange}
                required
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant='outlined'
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={createCollection}
                sx={{textTransform: 'none'}}
              >
                Create Collection
              </Button>
            </DialogActions>
          </Dialog>
          <Divider />
          {collections.map((collection) => {
            return (
              <MenuItem
                key={collection.id}
                onClick={() => getCollection(collection.id)}
              >
                <ListItemText>{collection.name}</ListItemText>
              </MenuItem>
            )
          })}
        </MenuList>
      </Paper>
    )
  }

  const CollectionBar = () => {

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
          null :
          <>
            <Button  sx={{textTransform: 'none', marginLeft: '20px'}}>Edit Name</Button>
            <Button  sx={{textTransform: 'none'}} onClick={removeCollection}>Remove</Button>
          </>
        }
      </Box>
    )
  }

  const Book = ({id, title, cover}) => {

    const removeBook = () => {
      console.log(id)
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
        <Box sx={{height: '300px', width: '140px'}}>
          <Box component={Link} to={`/book/?id=${id}`} className='remove-underline' sx={{color: 'black'}} >
            <img src={cover} alt="" style={{height: '200px', width: '140px'}}/>
            <Box sx={{height: '55px', overflow: 'auto'}}>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
            </Box>
          </Box>
          <Button onClick={removeBook}>Remove</Button>
        </Box>
      </>
    )
  }

  const CompletedBook = ({id, title, cover}) => {
    return (
      <>
        <Box sx={{height: '300px', width: '140px'}}>
          <Box component={Link} to={`/book/?id=${id}`} className='remove-underline' sx={{color: 'black'}} >
            <img src={cover} alt="" style={{height: '200px', width: '140px'}}/>
            <Box sx={{height: '55px', overflow: 'auto'}}>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
            </Box>
          </Box>
        </Box>
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
      }}>
        <CollectionBar/>
        <Divider sx={{marginTop: '10px', marginBottom: '10px'}}/>
        <Box sx={{overflow: 'auto'}}>
          <Grid
            container
            spacing={3}
          >
            {currentCollection.books.map((book) => {
              return (
                <Grid item xs={12} sm={6} md={2} key={book.id}>
                  {currentCollection.name === 'Reading History' ?
                    <CompletedBook id={book.id} title={book.title} cover={book.cover}/> 
                    : <Book id={book.id} title={book.title} cover={book.cover}/>}
                </Grid>
              )
            })}
          </Grid>
        </Box>
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