import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  FormLabel, InputLabel, Portal, Select,
} from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Checkbox from "antd/es/checkbox/Checkbox";
import axios from "axios";
import {url} from "./Helper";
import {useNavigate} from 'react-router-dom';
import MenuItem from "@mui/material/MenuItem";
import ErrorPopup from "./ErrorPopup";
import {padding} from "@mui/system";


const genres = ['Fiction', 'Romance', 'Fantasy', 'Young Adult', 'Contemporary', 'Nonfiction', 'Adult',
  'Novels', 'Mystery', 'Historical Fiction', 'Audiobook', 'Classics', 'Adventure', 'Historical',
  'Paranormal', 'Literature', 'Science Fiction', 'Childrens', 'Thriller', 'Magic', 'Humor'];


const Genres = ({updateSearchResult, updateSearchType, updateGenreRating, genreRating, updateSearchGenres, updatePageCount, updatePage}) => {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const genreSet = [];
  const genreList = {
    'Fiction': false,
    'Romance': false,
    'Fantasy': false,
    'Young Adult': false,
    'Contemporary': false,
    'Nonfiction': false,
    'Adult': false,
    'Novels': false,
    'Mystery': false,
    'Historical Fiction': false,
    'Audiobook': false,
    'Classics': false,
    'Adventure': false,
    'Historical': false,
    'Paranormal': false,
    'Literature': false,
    'Science Fiction': false,
    'Childrens': false,
    'Thriller': false,
    'Magic': false,
    'Humor': false
  }
  const [selectGenres, setSelectGenres] = useState(genreList);
  const [anchorElGenre, setAnchorELGenre] = useState(null);
  const openGenre = Boolean(anchorElGenre);
  const [ratingDisplay, setRatingDisplay] = useState(0);

  const handleChangeGenreRating = (event) => {
    setRatingDisplay(event.target.value);
  }

  const handleChangeGenre = (event) => {
    setSelectGenres({
      ...selectGenres,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClickGenre = (event) => {
    setAnchorELGenre(event.currentTarget);
  };

  const handleCloseGenre = () => {
    setAnchorELGenre(null);
    setRatingDisplay(0);
    setSelectGenres(genreList);
  };

  const getGenres = () => {
    for (let genre in selectGenres) {
      if (selectGenres[genre])
        genreSet.push(genre);
    }
    console.log(genreSet.join('&'))
    return genreSet.join('&');
  }

  const searchGenre = () => {
    let selectedGenres = getGenres();
    if (selectedGenres === '') {
      setShowError(true);
      setErrorMsg('Please choose at lease one genre');
      return
    }
    axios.get(`${url}/search/genre`, {params: {
        genres: selectedGenres,
        rating: ratingDisplay,
        page: 1
      }})
      .then(res => {
        updateGenreRating(ratingDisplay);
        updateSearchGenres(selectedGenres);
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
    handleCloseGenre();
  }

  return (
    <>
      <Portal>
        <ErrorPopup errorMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError}/>
      </Portal>
      <Button
        variant="contained"
        onClick={handleClickGenre}
      >
        Genres
      </Button>
      <Dialog open={openGenre} onClose={handleCloseGenre}>
        <DialogTitle>Genres</DialogTitle>
        <DialogContent sx={{height: '200px', overflow: 'auto'}}>
          <FormControl fullWidth>
            <InputLabel id="select-rating">Rating greater or equal than...</InputLabel>
            <Select
              labelId="select-rating"
              id="select-rating"
              value={ratingDisplay}
              label="rating"
              onChange={handleChangeGenreRating}
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{m:3}} component="fieldset" variant="standard">
            <FormLabel component="legend">Pick Genres</FormLabel>
            <FormGroup>
              {genres.map((genre) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox checked={selectGenres[genre]} onChange={handleChangeGenre} name={genre} />
                    }
                    label={genre}
                    key={genre}
                  />
                )
              })}
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            onClick={handleCloseGenre}
          >
            Cancel
          </Button>
        <Button
          variant='contained'
          onClick={searchGenre}
          sx={{textTransform: 'none'}}
        >
          Search
        </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Genres;