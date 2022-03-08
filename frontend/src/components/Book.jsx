
import axios from "axios";
import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Pagination from '@mui/material/Pagination';

const Book = () => {

  const [rating, setRating] = React.useState(2);

    return (  
      
      <Box sx={{ flexGrow: 1 }}>
        <h1>book</h1>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={3}>
            <Paper elevation={0} >
              haha
            </Paper>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={3}>
                <Button variant="contained">Complete</Button>
              </Grid> 

              <Grid item xs={3}>
                <Button variant="contained">Add to collection</Button>
              </Grid>
              <Grid item xs={3}>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />              
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={8}>
                <h3>harry potter</h3>
                <body>vjfkjb fkwegbdf</body>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained">Add Review</Button>
              </Grid>

              
              <Grid item xs={12}>
                <Paper elevation={0} >
                  <h3>fefewe</h3>
                 
                  <h3>fefewe</h3>
                </Paper>
                <Pagination count={10} size="small" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>

          </Grid>
          <Grid item xs={8}>
        
          </Grid>
        </Grid>
    </Box>
      
    );
  };
export default Book;