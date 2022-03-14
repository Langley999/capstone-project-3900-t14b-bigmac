import axios from "axios";
import React, { useState, useRef } from 'react';
import {Grid} from "@material-ui/core";
import BookSection from './BookSection';
import Box from "@mui/material/Box";


const SearchBooks = ({searchResult}) => {


  return (
    <Box sx={{marginTop: '20px'}}>
      <Grid
        container
        spacing={3}
        justifyContent="center"
      >
        {searchResult.map((bookInfo) => {
          return (
            <Grid item xs={12} sm={6} md={3}>
              <BookSection bookInfo={bookInfo}/>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  );
};
export default SearchBooks;