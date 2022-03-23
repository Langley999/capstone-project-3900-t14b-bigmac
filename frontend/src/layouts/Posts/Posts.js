import React, { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { url } from '../../components/Helper';
import '../../App.css';

import Button from '@mui/material/Button';
import {
  Box,
  CardActionArea,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography
} from "@material-ui/core";
import CardContent from "@mui/material/CardContent";
import Card from "@material-ui/core/Card";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import Rating from "@mui/material/Rating";

const data = [
  {
    post_id: 1,
    content: 'fiset post',
    time_created: '01/01/2022'
  },
  {
    post_id: 2,
    content: 'second post',
    time_created: '01/01/2022'
  }
]
const Posts = ({userInfo}) => {
  const urlParams = useParams();

  const [posts, setPosts] = useState([]);
  const [isSelf, setIsSelf] = useState(true);
  let initialPosts = [];
  const [open, setOpen] = useState(false);
  const [postFormOn, setReviewFormOn] = React.useState(false);
  const [postValue, setpostValue] = React.useState(null);

  useEffect(async () => {
    const user_id = Number(window.location.pathname.split('/')[2]);
    setIsSelf(user_id === userInfo.user_id);

    axios.get(`${url}/post/getposts`, {params: {
        token: localStorage.getItem('token'),
        user_id: user_id
      }})
      .then(res => {
        setPosts(res.data.posts);
        initialPosts = [...res['data']['posts']];
      })
      .catch(function (error) {
        alert("error")
        // alert(error.response.data.message);
      });
  }, [window.location.href])

  const handleAddPost = () => {
    setReviewFormOn(true);
  }

  const handleAddPostClose = () => {
    setReviewFormOn(false);
  }

  const handleSubmitPost = () => {
    // axios.post(`${url}/post/addpost`, {
    //   token: localStorage.getItem('token'),
    //   content: postValue
    // }).then(res => {
      // var datetime = currentdate.getFullYear() + "-"
      //   + (currentdate.getMonth()+1)  + "-"
      //   + currentdate.getDate() + " "
      //   + currentdate.getHours() + ":"
      //   + currentdate.getMinutes() + ":"
      //   + currentdate.getSeconds();

    //   const newPost = {
    //     post_id: res.data.post_id,
    //     content: postValue,
    //     time_created: datetime
    //   }
    //   setPosts([...posts, newPost])
    // })
  }


  const CreatePost = () => {
    return (
      <Dialog onClose={handleAddPostClose} open={postFormOn}>
        <Box
          sx={{
            width: 1000,
            height: 500,
            maxWidth: '100%',
          }}
        >
          <Grid container direction="column" alignItems="center" justifyContent="flex-start" spacing={0}>
            <DialogTitle>Write a post</DialogTitle>
            <Box
              sx={{
                paddingTop:3,
                width: 500,
                maxWidth: '100%',
              }}
            >
              <TextField fullWidth label="" id="fullWidth" multiline={true} value={postValue}
                         onChange={(e) => setpostValue(e.target.value)} rows={12} />
            </Box>
            <Button onClick={handleAddPostClose}>Cancel</Button>
            <Button onClick={handleSubmitPost}>Submit</Button>
          </Grid>

        </Box>
      </Dialog>
    )
  }

  return (
    <>
      {isSelf ? <Button onClick={handleAddPost}>Add Post</Button> : null}
      <CreatePost/>

      {data.map(postInfo => {
        return (
          // <PostSection postInfo={postInfo}/>
          <></>
        )
      })}
    </>
  );
};
export default Posts;