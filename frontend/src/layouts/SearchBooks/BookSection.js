import React from 'react';
import Card from '@material-ui/core/Card';
import {CardActionArea} from '@mui/material';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import {convertDate,months} from '../../components/Helper';

/**
 * BookSection component is for each book showing on search result
 */
const BookSection = ({bookInfo}) => {
  let converteddate = bookInfo.publish_date;
  if (converteddate === '')
    converteddate = 'Not Available';
  if (months.includes(bookInfo.publish_date.split(' ')[0]) ) {
    converteddate = convertDate(bookInfo.publish_date);
  }
  return (
    <Card>
      <CardActionArea component={Link} to={`/book/?id=${bookInfo.id}`}>
        <Box sx={{display: 'flex'}}>
          {bookInfo.cover === '' ?
            <img src={'https://islandpress.org/sites/default/files/default_book_cover_2015.jpg'} alt='' style={{height: '250px', width: '175px'}}/> :
            <img src={bookInfo.cover} alt='' style={{height: '250px', width: '175px'}}/>
          }

          <Box sx={{padding: '10px'}}>
            <Box sx={{height: '110px', overflow: 'auto'}}>
              <Typography gutterBottom variant='h6' component='div' sx={{textDecoration: 'none'}}>
                {bookInfo.title}
              </Typography>
            </Box>
            <Box sx={{height: '50px', overflow: 'auto', marginBottom: '10px'}}>
              <Typography variant='body2' style={{color: '#757575'}}>
                {bookInfo.author}
              </Typography>
            </Box>
            <Box sx={{height: '20px', overflow: 'auto', marginBottom: '10px'}}>
              <Typography variant='body2' style={{color: '#757575'}}>
                {converteddate}
              </Typography>
            </Box>
            <Box sx={{display: 'flex'}}>
              <Rating
                name={'rating-read'}
                defaultValue={Math.round(bookInfo.average_rating * 10) /10}
                precision={0.5}
                readOnly
              />
              <Typography variant='body2' style={{color: '#757575', marginLeft: '10px'}}>
                {Math.round(bookInfo.average_rating * 10) /10}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  )
};
export default BookSection;