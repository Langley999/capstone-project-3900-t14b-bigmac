import React, { useState, useRef } from 'react';
import Card from "@material-ui/core/Card";
import {CardActionArea} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import Box from "@mui/material/Box";
import Rating from '@mui/material/Rating';


const BookSection = ({bookInfo}) => {


  return (
    <Card>
      <CardActionArea component={Link} to={`/book/?id=${bookInfo.id}`}>
        <Box sx={{display: 'flex'}}>
          <img src={bookInfo.cover} alt="" style={{height: '250px', width: '175px'}}/>
          <Box sx={{padding: '10px'}}>
            <Box sx={{height: '100px', overflow: 'auto'}}>
              <Typography gutterBottom variant="h6" component="div" sx={{textDecoration: 'none'}}>
                {bookInfo.title}
              </Typography>
            </Box>
            <Box sx={{height: '50px', overflow: 'auto', marginBottom: '10px'}}>
              <Typography variant="body2" color="text.secondary">
                {bookInfo.author}
              </Typography>
            </Box>
            <Rating
              name={"rating-read"}
              defaultValue={Math.round(bookInfo.average_rating * 10) /10}
              precision={0.5}
              readOnly
            />
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  )
};
export default BookSection;