import React, { useState, useRef } from 'react';
import Card from "@material-ui/core/Card";
import {CardActionArea} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";


const BookSection = ({bookInfo}) => {


  return (
    <Card sx={{ maxWidth: 345 }} component={Link} to={`/book/?id=${bookInfo.id}`}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={bookInfo.cover}
          alt="book cover"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {bookInfo.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {bookInfo.author}
          </Typography>
          <Typography variant="body2">
            {bookInfo.average_rating}
          </Typography>
        </CardContent>
      </CardActionArea>

    </Card>
  )
};
export default BookSection;