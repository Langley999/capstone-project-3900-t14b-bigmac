import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom';
import {url} from '../../components/Helper';

/**
 * Display similar books based on one book on book detail page
 */
const SimilarBooks = ({book_id, setwarningcontent, setwarningopen}) => {
  const [similarbooks, setSimilarbooks] = useState([]);
  useEffect(() => {
    axios.get(`${url}/book/similarbooks`, {
      params: {
        book_id: book_id
      }
    })
    .then(function (response) {
      console.log(response['data']['books']);
      
      setSimilarbooks(response['data']['books']);
    })
    .catch(function (error) {
      setwarningcontent(error.response.data.message);
      setwarningopen(true);
    });

  }, [window.location.href]);

  return (
    <Grid container direction='column' alignItems='center' justifyContent='flex-start' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6' display='block' gutterBottom>
          You may also like ...
        </Typography>
      </Grid>
      {similarbooks.length > 0 &&  similarbooks.map((item, i) =>
          
      <Grid item xs={12} style={{textAlign: 'center'}} key={i}>
        <Grid container direction='column' alignItems='center' justifyContent='flex-start' spacing={2}>
          <Grid item xs={12} style={{textAlign: 'center'}}>
          <Box component={Link} to={`/book/?id=${item['id']}`}  >
            <Box
              component='img'
              sx={{
                width: 100,
                ml: 0
              }}
              alt='book cover'
              src={item['cover_image']}
            />
          </Box>               
          </Grid>
          <Grid item xs={12} style={{textAlign: 'center'}}> 
            <Box component={Link} to={`/book/?id=${item['id']}`} style={{width: '600px',textDecoration: 'none'}} >
              <Button color='primary' style={{width: '150px', textDecoration: 'none'}}>
                {item['title']}
              </Button>               
            </Box>
          </Grid>

        </Grid>
      </Grid>
      
      )}
    </Grid>
  )
}

export default SimilarBooks;