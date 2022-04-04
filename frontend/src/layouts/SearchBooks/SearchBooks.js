import axios from "axios";
import React, { useState, useRef } from 'react';
import {Grid} from "@material-ui/core";
import BookSection from './BookSection';
import Box from "@mui/material/Box";
import {Pagination} from "@mui/material";
import {url} from "../../components/Helper";


const SearchBooks = ({searchResult, updateSearchResult, radioValue, searchValue, searchRating, updatePage, page, pageCount, searchType}) => {
  const handleChangePage = (event, value) => {
    updatePage(value);
    console.log(searchType)
    if (searchType === 'byValue') {
      axios.get(`${url}/search/searchbook`, {
        params: {
          type: radioValue,
          value: searchValue,
          rating: searchRating,
          page: value
        }
      })
        .then(res => {
          updateSearchResult(res.data.books);
        })
        .catch(function (error) {
          alert(error.response.data.message);
        });
    } else {
      // axios.get(`${url}/search/genre`, {params: {
      //     genres: selectedGenres,
      //     rating: genreRating,
      //     page: 1
      //   }})
      //   .then(res => {
      //     updateSearchGenres(selectedGenres);
      //     updateSearchType('byGenre');
      //     console.log(res.data.books);
      //     updateSearchResult(res.data.books);
      //     navigate('searchbooks');
      //   })
      //   .catch(function (error) {
      //     alert(error.message);
      //   });
    }
  }

  return (
    <Box sx={{marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Grid
        container
        spacing={3}
        justifyContent="center"
      >
        {searchResult.length > 0 ? searchResult.map((bookInfo) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={bookInfo.id}>
              <BookSection bookInfo={bookInfo}/>
            </Grid>
          )
        }) : <div style={{paddingTop: "50px"}}>There were no books that matched the phrase</div>}
      </Grid>
      <Pagination sx={{marginBottom: '20px', marginTop: '30px'}} count={pageCount} page={page} onChange={handleChangePage} />
    </Box>
  );
};
export default SearchBooks;