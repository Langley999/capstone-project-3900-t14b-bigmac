import React, { useState, useRef } from 'react';
import {Link} from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Typography
} from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Checkbox from "antd/es/checkbox/Checkbox";
import axios from "axios";
import {url} from "./Helper";
import {useNavigate} from 'react-router-dom';


const genres = ['Fiction', 'Romance', 'Fantasy', 'Young Adult', 'Contemporary', 'Nonfiction', 'Adult',
  'Novels', 'Mystery', 'Historical Fiction', 'Audiobook', 'Classics', 'Adventure', 'Historical',
  'Paranormal', 'Literature', 'Science Fiction', 'Childrens', 'Thriller', 'Magic', 'Humor'];


const Genres = ({updateSearchResult}) => {
  const navigate = useNavigate();
  const genreSet = [];
  const [selectGenres, setSelectGenres] = useState({
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
  })
  const [anchorElGenre, setAnchorELGenre] = useState(null);
  const openGenre = Boolean(anchorElGenre);

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
    axios.get(`${url}/search/genre`, {params: {
        genres: getGenres(),
        rating: 0
      }})
      .then(res => {
        updateSearchResult(res.data.books);
        navigate('searchbooks');
      })
      .catch(function (error) {
        alert(error.response.data.message);
      });
    handleCloseGenre();
  }

  return (
    <>
      <Button
        onClick={handleClickGenre}
      >
        Genres
      </Button>
      <Dialog open={openGenre} onClose={handleCloseGenre}>
        <DialogTitle>Genres</DialogTitle>
        <DialogContent sx={{height: '200px', overflow: 'auto'}}>
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
          Apply
        </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Genres;