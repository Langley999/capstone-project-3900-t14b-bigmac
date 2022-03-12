import axios from "axios";
import React, { useState, useRef } from 'react';
import {Grid} from "@material-ui/core";
import BookSection from './BookSection';


const SearchBooks = ({searchResult}) => {


  return (
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

  );
};
export default SearchBooks;