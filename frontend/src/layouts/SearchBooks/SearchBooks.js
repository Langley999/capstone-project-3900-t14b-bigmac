import axios from 'axios';
import React from 'react';
import {Grid} from '@material-ui/core';
import BookSection from './BookSection';
import Box from '@mui/material/Box';
import {Pagination} from '@mui/material';
import {url} from '../../components/Helper';
import ErrorPopup from '../../components/ErrorPopup';


/**
 * Showing the search results
 */
const SearchBooks = ({searchResult, updateSearchResult, radioValue, searchValue, tempsearchRating, updatePage, page, pageCount, searchType, searchGenres, genreRating, followingFav}) => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  
  const pageSize = 12;

  const handleChangePage = (event, value) => {
    updatePage(value);
    if (searchType === 'byValue') {
      axios.get(`${url}/search/searchbook`, {
        params: {
          type: radioValue,
          value: searchValue,
          rating: tempsearchRating,
          page: value
        }
      })
        .then(res => {
          updateSearchResult(res.data.books);
        })
        .catch(function (error) {
          setErrorMsg(error.response.data.message);
          setShowError(true);
        });
    } else if (searchType === 'byGenre') {
      axios.get(`${url}/search/genre`, {params: {
          genres: searchGenres,
          rating: genreRating,
          page: value
        }})
        .then(res => {
          updateSearchResult(res.data.books);
        })
        .catch(function (error) {
          setErrorMsg(error.response.data.message);
          setShowError(true);
        });
    } else {
      const start = (value-1)*pageSize;
      const end = value * pageSize;
      updateSearchResult(followingFav.slice(start, end));
    }
  }

  return (
    <Box sx={{marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Grid
        container
        spacing={3}
        justifyContent='center'
      >
        {searchResult.length > 0 ? searchResult.map((bookInfo) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={bookInfo.id}>
              <BookSection bookInfo={bookInfo}/>
            </Grid>
          )
        }) : <div style={{paddingTop: '50px'}}>There were no books that matched the phrase</div>}
      </Grid>
      <Pagination sx={{marginBottom: '20px', marginTop: '30px'}} count={pageCount} page={page} onChange={handleChangePage} />
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError} />
    </Box>
  );
};
export default SearchBooks;