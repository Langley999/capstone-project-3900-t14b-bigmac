import React, {useEffect, useState} from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import {url} from '../../components/Helper';
import '../../App.css';
import Button from '@mui/material/Button';
import {Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography} from '@material-ui/core';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import ErrorPopup from '../../components/ErrorPopup';
import SuccessPopup from '../../components/SuccessPopup';
import {Pagination} from '@mui/material';

/**
 * Collections component is the page for user's collections
 * and books in the collections
 */
const Collections = ({userInfo}) => {
  const urlParams = useParams();

  const [warningopen, setwarningopen] = useState(false);
  const [warningcontent, setwarningcontent] = useState('');
  const [snackbaropen, setsnackbaropen] = useState(false);
  const [snackbarcontent, setsnackbarcontent] = useState('');

  const [canRemove, setCanRemove] = useState(false);
  const [isSaved, setIsSaved] = useState('no');
  const [saveStatus, setSaveStatus] = useState('Save');
  const [collections, setCollections] = useState([]);
  const [saved, setSaved] = useState([]);
  const [isSelf, setIsSelf] = useState(false);
  let initialCollections = [];
  const [open, setOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState({
    collection_id: '',
    name: '',
    books: []
  });
  let nameValue = '';   // the name of created collection
  const [openRename, setOpenRename] = useState(false);
  const [rendering, setRendering] = useState('');
  let renameValue = '';
  const user_id = Number(window.location.pathname.split('/')[2]);
  const [recentlyAdd, setRecentlyAdd] = useState({});
  const [pageBooks, setPageBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(10);
  const pageSize = 12;

  useEffect(async () => {
    setIsSelf(user_id === userInfo.user_id);

    axios.get(`${url}/collection/getall`, {
      params: {
        user_id: user_id
      }
    })
      .then(res => {
        setCollections(res['data']['collections']);
        initialCollections = [...res['data']['collections']]
        // default show Favourite Collection
        getCollection(getFavouriteCollectionIdByFlag(), 'no', '');
      })
      .catch(function (error) {
        setwarningcontent(error.message);
        setwarningopen(true);
      });

    axios.get(`${url}/collection/savedcollections`, {params: {
      token: localStorage.getItem('token'),
      user_id: user_id
    }})
      .then(res => {
        setSaved(res['data']['collections']);
      })
      .catch(function (error) {
        setwarningcontent(error.message);
        setwarningopen(true);
      });

    axios.get(`${url}/collection/recentbooks`, {params: {
      token: localStorage.getItem('token'),
      user_id: user_id
    }})
      .then(res => {
        setRecentlyAdd({
          collection_id: -1,
          name: 'Recently Added',
          books: res.data.books
        })
      })
  }, [window.location.href, rendering, userInfo]);

  const handleChangePage = (event, value) => {
    setPage(value);
    const start = (value-1)*pageSize;
    const end = value * pageSize;
    setPageBooks(currentCollection['books'].slice(start, end));
  }


  const handleChange = (e) => {
    nameValue = e.target.value;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createCollection = () => {
    if (nameValue === '') {
      setwarningopen(true);
      setwarningcontent('Collection name cannot be empty.');
      return;
    }
    if (collections.filter((collection) => collection.name === nameValue).length !== 0) {
      setwarningopen(true);
      setwarningcontent('Cannot have duplicate collection name.');
      return;
    }

    axios.post(`${url}/collection/create`, {
      name: nameValue,
      token: localStorage.getItem('token')
    }).then(res => {
      const created = {
        id: res['data']['id'],
        name: nameValue,
        flag: 3
      }
      const newCollections = [...collections];
      setCollections([...newCollections, created]);
      handleClose();
    })
      .catch(function (error) {
        setwarningcontent(error.message);
        setwarningopen(true);
      });
  }

  // get favourite collection id by flag
  const getFavouriteCollectionIdByFlag = () => {
    for (let collection of initialCollections) {
      if (collection['flag'] === 1) {
        return collection.id
      }

    }
  }

  // show books when click a specific collection
  const getCollection = (collection_id, isSavedFlag, save_from) => {
    if (collection_id) {
      axios.get(`${url}/collection/getcollection`, {params: {
          token: localStorage.getItem('token'),
          collection_id: collection_id
        }})
        .then(res => {
          setIsSaved(isSavedFlag);
          setCurrentCollection({
            collection_id: collection_id,
            name: res.data.name,
            books: res.data.books,
            has_saved: res.data.has_saved,
            save_from: save_from
          })
          setPage(1);
          setPageCount(Math.ceil(res.data.books.length / pageSize));
          setPageBooks(res.data.books.slice(0, pageSize));
          if (res.data.has_saved)
            setSaveStatus('Unsave');
          else
            setSaveStatus('Save');

          if ((user_id === userInfo.user_id) && res.data.name !== 'Reading History' && isSavedFlag === 'no') {
            setCanRemove(true);
          } else {
            setCanRemove(false);
          }
        })
        .catch(function (error) {
          setwarningcontent(error.message);
          setwarningopen(true);
        });
    }
  }

  // show a list of collections
  const Sidebar = () => {
    const clickRecentlyAdd = () => {
      setCurrentCollection(recentlyAdd);
      setPage(1);
      setPageCount(Math.ceil(recentlyAdd.books.length / pageSize));
      setPageBooks(recentlyAdd.books.slice(0, pageSize));
      setCanRemove(false);
      setIsSaved('no');
    }

    const clickSavedCollection = (c) => {
      if (isSelf)
        getCollection(c.collection_id, 'my', c.username);
      else
        getCollection(c.collection_id, 'other', c.username);
    }

    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Paper sx={{ width: 200, maxWidth: '100%', height: 300, overflow: 'auto'}}>
          <MenuList>
            <MenuItem>
              <ListItemText onClick={clickRecentlyAdd}>Recently Added</ListItemText>
            </MenuItem>
            {isSelf ?
              <div>
                <Divider/>
                <MenuItem>
                  <ListItemText onClick={handleClickOpen}>+ Add Collection</ListItemText>
                </MenuItem>
              </div>
              : null
            }
            <Divider />
            {collections.map((collection) =>
              <>
                <MenuItem
                  key={collection.id}
                  onClick={() => getCollection(collection.id,'no', '')}
                >
                  <ListItemText>{collection.name}</ListItemText>
                </MenuItem>
                <Divider/>
              </>
            )}
          </MenuList>
        </Paper>

        <Paper sx={{ width: 200, marginTop: '20px',maxWidth: '100%', height: 300, overflow: 'auto'}}>
          <MenuList>
            <MenuItem>
              <ListItemText>Saved Collections</ListItemText>
            </MenuItem>
            <Divider />
            {saved.map((c) =>
              <>
                  <MenuItem
                    key={c.collection_id}
                    onClick={() => clickSavedCollection(c)}
                  >
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <ListItemText>{c.name}</ListItemText>
                      <ListItemText>({c.username})</ListItemText>
                    </Box>
                  </MenuItem>
                  <Divider/>
              </>
            )}
          </MenuList>
        </Paper>
      </div>
    )
  }

  // show the detail of a collection
  const CollectionBar = () => {
    const handleChangeRename = (event) => {
       renameValue = event.target.value;
    }

    const handleClickOpenRename = () => {
      setOpenRename(true);
    };

    const handleCloseRename = () => {
      setOpenRename(false);
    };

    const renameCollection = () => {
      axios.post(`${url}/collection/rename`, {
        token: localStorage.getItem('token'),
        collection_id: currentCollection.collection_id,
        name: renameValue
      }).then(res => {
        setCurrentCollection({
          collection_id: currentCollection.collection_id,
          name: renameValue,
          books: currentCollection.books
        })
        axios.get(`${url}/collection/getall`, {
          params: {
            user_id: user_id
          }
        })
          .then(res => {
            setCollections(res['data']['collections']);
            // default show Favourite Collection
          })
          .catch(function (error) {
            setwarningcontent(error.message);
            setwarningopen(true);
          });
        handleCloseRename();
      })
    }

    const removeCollection = () => {

      axios.delete(`${url}/collection/removecollection`, {data: {
          token: localStorage.getItem('token'),
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
          getCollection(fav, 'no', '');
        })
        .catch(error => {
          setwarningcontent(error.message);
          setwarningopen(true);
        })
    }

    const unsaveCollection = () => {
      axios.post(`${url}/collection/unsavecollection`, {
        token: localStorage.getItem('token'),
        collection_id: currentCollection.collection_id
      })
        .then(res => {
          const newSaved = saved.filter((collection) => collection.collection_id !== currentCollection.collection_id);
          setSaved(newSaved);
          setsnackbarcontent('Unsave collection successfully!');
          setsnackbaropen(true);
          setSaveStatus('Save');

          // automatically show Favourite Collection after unsaving a collection
          let fav = -1;
          for (let collection of collections) {
            if (collection['flag'] === 1) {
              fav = collection.id;
            }
          }
          getCollection(fav, 'no', '');
        })
        .catch(error => {
          setwarningcontent(error.message);
          setwarningopen(true);
        })
    }

    const saveCollection = () => {
      axios.post(`${url}/collection/savecollection`, {
        token: localStorage.getItem('token'),
        collection_id: currentCollection.collection_id
      })
      .then(res => {
        setsnackbarcontent('Save collection successfully!');
        setsnackbaropen(true);
        setSaveStatus('Unsave');
      })
      .catch(error => {
        setwarningcontent(error.message);
        setwarningopen(true);
      })
    }

    const changeSaveStatus = () => {
      if (saveStatus === 'Unsave')
        unsaveCollection();
      else
        saveCollection();
    }

    return (
      <>
        <Dialog open={openRename} onClose={handleCloseRename}>
          <DialogTitle>Rename Collection</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label='New Name'
              name='collectionRename'
              onChange={handleChangeRename}
              required
              variant='outlined'
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant='outlined'
              onClick={handleCloseRename}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={renameCollection}
              sx={{textTransform: 'none'}}
            >
              Apply
            </Button>
          </DialogActions>
        </Dialog>
        <Box sx={{display: 'flex'}}>
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography variant='h4'>{currentCollection.name}</Typography>
            {currentCollection.save_from !== '' ? <Typography sx={{marginBottom: '20px'}}>({currentCollection.save_from})</Typography> : null}
          </Box>
          {currentCollection.name === 'Recently Added' || currentCollection.name === 'Favourite' || currentCollection.name === 'Reading History' || !isSelf || isSaved !== 'no'?
            null :
            <>
              <Button onClick={handleClickOpenRename} sx={{textTransform: 'none', marginLeft: '20px'}}>Rename</Button>
              <Button  sx={{textTransform: 'none'}} onClick={removeCollection}>Remove</Button>
            </>
          }
          {!isSelf && currentCollection.name !== 'Recently Added'  && isSaved === 'no' ?
            <Button sx={{marginLeft: '20px'}} onClick={changeSaveStatus}>{saveStatus}</Button>
            : null
          }
          {isSaved === 'my' ?
            <Button sx={{marginLeft: '20px'}} onClick={unsaveCollection}>Unsave</Button>
            : null
          }
        </Box>
      </>
    )
  }

  // component for a book in a collection
  const Book = ({id, title, cover}) => {

    const removeBook = () => {
      axios.delete(`${url}/collection/removebook`, {data: {
          token: localStorage.getItem('token'),
          collection_id: currentCollection.collection_id,
          book_id: id
        }
      }).then(res => {
        const newBooks = currentCollection.books.filter((book) => book.title !== title);
        const newC = {
          collection_id: currentCollection.collection_id,
          name: currentCollection.name,
          books: newBooks
        }
        setCurrentCollection(newC);
        setPageCount(Math.ceil(newC.books.length / pageSize));
        let p = page;
        if (page > Math.ceil(newC.books.length / pageSize)) {
          setPage(page - 1);
          p = p-1;
        }
        const start1 = (p-1)*pageSize;
        const end1 = p * pageSize;
        setPageBooks(newC['books'].slice(start1, end1));
      })
        .catch(error => {
          setwarningcontent(error.response.data.message);
          setwarningopen(true);
        });
    }

    return (
      <>
        <Box sx={{height: '300px', width: '140px'}}>
          <Box component={Link} to={`/book/?id=${id}`} className='remove-underline' sx={{color: 'black'}} >
            <img src={cover} alt='' style={{height: '200px', width: '140px'}}/>
            <Box sx={{height: '55px', overflow: 'auto'}}>
              <Typography variant='body2' style={{color: '#757575'}}>
                {title}
              </Typography>
            </Box>
          </Box>
          {canRemove ?
            <Button onClick={removeBook}>Remove</Button>
            : null
          }
        </Box>
      </>
    )
  }

  // all the books in the collection
  const Books = () => {

    return (
      <Paper sx={{
        width: '100%',
        height: '760px',
        marginLeft: '40px',
        padding: '20px',
      }}>
        <CollectionBar/>
        <Divider sx={{marginTop: '10px', marginBottom: '10px'}}/>
        <Box sx={{
          height: '670px',
          overflow: 'auto',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Grid
            container
            spacing={3}
          >
            {pageBooks.map((book) => {
              return (
                <Grid item xs={12} sm={6} md={2} key={book.id}>
                  <Book id={book.id} title={book.title} cover={book.cover}/>
                </Grid>
              )
            })}
          </Grid>
          {page}
          <Pagination count={pageCount} page={page} onChange={handleChangePage} />
        </Box>
      </Paper>
    )
  }

  return (
    <>
      <ErrorPopup errorMsg={warningcontent} snackBarOpen={warningopen} setSnackBarOpen={setwarningopen}/>
      <SuccessPopup successMsg={snackbarcontent} snackBarOpen={snackbaropen} setSnackBarOpen={setsnackbaropen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Collection</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='Collection Name'
            name='collectionName'
            onChange={e => handleChange(e)}
            required
            variant='outlined'
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