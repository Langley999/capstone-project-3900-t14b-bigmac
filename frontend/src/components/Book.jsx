
import axios from "axios";
import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Pagination from '@mui/material/Pagination';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
const text1 = ""
const Book = () => {

  const [rating, setRating] = React.useState(2);

  const [reviewFormOn, setReviewFormOn] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleAddReview = () => {
    setReviewFormOn(true);
  }
  const handleAddCollection = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleAddReviewClose = () => {
    setReviewFormOn(false);
  }
  const handleAddCollectionClose = () => {
    setAnchorEl(null);
  }

    return (  
      <Box sx={{ flexGrow: 1, mt: 12,ml: 0 }} >
        <Grid container direction="row" spacing={3}>
          <Grid item xs={3}>
         
            <Grid container direction="column" alignItems="center" justifyContent="flex-start" spacing={2}>
              <Grid item xs={12}>
                <Box
                  component="img"
                  sx={{
                    height: 350,
                    my:2
                  }}
                  alt="book cover"
                  src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1586722975l/2767052.jpg" 
                />
              </Grid>
              
              <Grid item xs={6}>
                <Button variant="contained" style={{maxWidth: '150px', minWidth: '150px'}} startIcon={<CheckCircleOutlineIcon />}>Complete</Button>
              </Grid>

              <Grid item xs={6}>
                <Button variant="contained" style={{maxWidth: '150px', minWidth: '150px'}} startIcon={<LibraryAddIcon />} onClick={handleAddCollection}>Collection</Button>
              </Grid>
              <Grid item xs={6}>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />                
              </Grid>
              <Grid item xs={7}> 
                <Box display="flex" flexDirection="column" alignItems='center'>
                  <Typography variant="caption" gutterBottom component="div">Publisher: Scholastic Press</Typography>
                  <Typography variant="caption" gutterBottom component="div">Publish Date: 09/14/08</Typography>
                  <Typography variant="caption" gutterBottom component="div">Tags: Young Adult, Fiction, Fantasy, Adventure</Typography>
                </Box>
                
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6}>
            <Grid container direction="row" spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h4" style={{ fontWeight: 500,paddingTop:10 }} gutterBottom component="div">The Hunger Game</Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row" spacing={0}>
                <Grid item xs={3}>
                  <Box sx={{ flexGrow: 1, mb: 3}} >
                    <Typography variant="subtitle1" style={{ fontWeight: 800 }} gutterBottom component="div">by Suzanne Collins</Typography>
                  </Box>
                </Grid> 
                  <Grid item xs={2}>
                    <Box sx={{ flexGrow: 1, ml: 10}} >
                      <Rating
                        name="simple-controlled"
                        value={4.5}
                        precision={0.01}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={2}>
                    <Box sx={{ flexGrow: 1, ml: 6}} >
                      <Typography variant="caption" display="block" gutterBottom>4.96 (493)</Typography> 
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>WINNING MEANS FAME AND FORTUNE.LOSING MEANS CERTAIN DEATH.THE HUNGER GAMES HAVE BEGUN. . . .In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. The Capitol is harsh and cruel and keeps the districts in line by forcing them all to send one boy and once girl between the ages of twelve and eighteen to participate in the annual Hunger Games, a fight to the death on live TV.Sixteen-year-old Katniss Everdeen regards it as a death sentence when she steps forward to take her sister's place in the Games. But Katniss has been close to dead before—and survival, for her, is second nature. Without really meaning to, she becomes a contender. But if she is to win, she will have to start making choices that weight survival against humanity and life against love.</Typography>
              </Grid>
       


              <Grid item xs={12}>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ flexGrow: 1, mt: 8,ml: 0 }} >
                      <Typography variant="h6" gutterBottom component="div">Community Reviews</Typography>
                    </Box>
                    <Divider/>
                  </Grid>
                  <Grid item xs={2}>
                    <Box sx={{ flexGrow: 1, mt: 1}}>
                      <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                          setRating(newValue);
                        }}
                      /> 
                    </Box>
                  </Grid>
                  <Grid item xs={5}>
                    <Button startIcon={<DriveFileRenameOutlineIcon />} onClick={() => handleAddReview()}>Add Review</Button>
                  </Grid>
                </Grid>
              </Grid>


              
              <Grid item xs={12}>
              
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={1}>
                    <Box
                      component="img"
                      sx={{
                        height: 50,
                        my:1
                      }}
                      alt="avatar"
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                    />
                  </Grid>
                  <Grid item xs={11}>
                    <Grid container direction="row" spacing={0}>
                      <Grid item xs={1}>
                        <Typography variant="subtitle2" style={{ fontWeight: 600 }} display="block" gutterBottom> Emily </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Rating
                          size="small"
                          value={4}
                        />  
                      </Grid>
                      <Grid item xs={11}>
                        <Typography variant="body2" display="block" gutterBottom>Some parents may find the book "violent" but it is definitely violence with a purpose. A parent or teacher should always look at the message behind the violence. If it is taught correctly, then your child will come out of the book actually advocating for less violence in current and to stop the glorifying of violence.
      Personally, I teach this to my 7th graders, who every year, read it maturely and analyze the purpose of the violent nature of the book. Sure, if you just read it for face value and don't teach your child or your student the purpose then of course they will read it as just entertainment. Trust your kid's and trust your student's intelligence to be able to understand the deeper meaning behind the novel, which is actually advocating for less violence in the media, not more violence.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
            
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ flexGrow: 1, mt: 3,ml: 50,mb: 5}} >
                    <Pagination count={10} size="small" />
                  </Box>
                </Grid>
              </Grid>

            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container direction="column" alignItems="center" justifyContent="flex-start" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" display="block" gutterBottom>
                  You may also like ...
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Box
                  component="img"
                  sx={{
                    width: 100,
                    ml: 0
                  }}
                  alt="book cover"
                  src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1586722975l/2767052.jpg" 
                />
                <Typography variant="body2" display="block" gutterBottom>
                  Harry potter
                </Typography>

              </Grid>
              <Grid item xs={3}>
                <Box
                    component="img"
                    sx={{
                      width: 100,
                      my:0
                    }}
                    alt="book cover"
                    src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1586722975l/2767052.jpg" 
                  />
                <Typography variant="body2" display="block" gutterBottom>
                  Harry potter
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Box
                  component="img"
                  sx={{
                    width: 100,
                    my:0
                  }}
                  alt="book cover"
                  src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1586722975l/2767052.jpg" 
                />  
                <Typography variant="body2" display="block" gutterBottom>
                  Harry potter
                </Typography>              
              </Grid>

            </Grid>
          </Grid>
       
        </Grid>




      <Dialog onClose={handleAddReviewClose} open={reviewFormOn}>
        <Box
          sx={{
            width: 1000,
            height: 500,
            maxWidth: '100%',
          }}
        >
         <Grid container direction="column" alignItems="center" justifyContent="flex-start" spacing={0}>
          <DialogTitle>Write a review</DialogTitle>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            /> 
            <Box
              sx={{
                paddingTop:3,
                width: 500,
                maxWidth: '100%',
              }}
            >
              <TextField fullWidth label="" id="fullWidth" multiline={true} rows={12} />
            </Box>
            <Button>Submit</Button>
         </Grid>

        </Box>
      </Dialog>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleAddCollectionClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>Add to collection</Typography>
        <Grid container direction="column" spacing={0}>
          <Button startIcon={<AddIcon />}>Create</Button>
          <Button>Favourate</Button>
          <Button> To Read</Button>
          <Button> Sci Fi</Button>          
        </Grid>

      </Popover>
    </Box>

      
    );
  };
export default Book;