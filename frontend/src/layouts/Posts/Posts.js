import React, { useState, useEffect } from 'react';
import { url } from '../../components/Helper';
import '../../App.css';

import Button from '@mui/material/Button';
import {
  Box,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
} from "@material-ui/core";
import CardContent from "@mui/material/CardContent";
import Card from "@material-ui/core/Card";
import axios from "axios";
import {useParams} from "react-router-dom";
import UsernameLink from "../../components/UsernameLink";
import {Pagination} from "@mui/material";
import ErrorPopup from "../../components/ErrorPopup";
import SuccessPopup from "../../components/SuccessPopup";
import FeedListing from '../Feed/FeedListing';

const Posts = ({userInfo}) => {
  const urlParams = useParams();

  let newPost = '';
  const [posts, setPosts] = useState([]);
  const [isSelf, setIsSelf] = useState(true);
  const [postFormOn, setReviewFormOn] = React.useState(false);
  const [tempPost, setTempPost] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [values, setValues] = useState({});
  const [pagePosts, setPagePosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(10);
  const pageSize = 12;

  useEffect(async () => {
    const user_id = Number(window.location.pathname.split('/')[2]);
    setIsSelf(user_id === userInfo.user_id);

    axios.get(`${url}/user/profile`, {
      params: {
        user_id: user_id,
        token: localStorage.getItem('token')
      }
    })
      .then(function (res) {
        if (user_id === userInfo.user_id) {
          setValues(userInfo);
        } else {
          setValues({
            user_id: user_id,
            username: res['data']['username'],
            avatar: res['data']['avatar']
          });
        }
      })

    axios.get(`${url}/post/getposts`, {params: {
        user_id: user_id
      }})
      .then(res => {
        setPosts(res.data.posts);
        setPage(1);
        setPageCount(Math.ceil(res.data.posts.length / pageSize))
        setPagePosts(res.data.posts.slice(0, pageSize));
      })
      .catch(function (error) {
        setErrorMsg(error.response.data.message);
        setShowError(true);
      });
  }, [window.location.href, userInfo])

  const handleChangePage = (event, value) => {
    setPage(value);
    const start = (value-1)*pageSize;
    const end = value * pageSize;
    setPagePosts(posts.slice(start, end));
  }


  const handleAddPost = () => {
    setReviewFormOn(true);
  }

  const handleAddPostClose = () => {
    setReviewFormOn(false);
    newPost = '';
  }

  const handleChange = (event) => {
    newPost = event.target.value;
  }

  const handleSubmitPost = () => {
    if (newPost.length > 400) {
      setErrorMsg('Please enter less than 200 characters.');
      setShowError(true);
      return;
    }
    axios.post(`${url}/post/addpost`, {
      token: localStorage.getItem('token'),
      content: newPost
    }).then(res => {
      const currentdate = new Date();
      const datetime = currentdate.getFullYear() + "-"
        + (currentdate.getMonth()+1)  + "-"
        + currentdate.getDate() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

      const createdPost = {
        post_id: res.data.post_id,
        content: newPost,
        time_created: datetime
      }
      // setTempPost(createdPost);
      let temp = [...posts];
      temp.unshift(createdPost)
      setPosts(temp);
      setPageCount(Math.ceil(temp.length / pageSize))
      setPage(1);
      setPagePosts(temp.slice(0, pageSize));
      handleAddPostClose();
      setSuccessMsg("You made a post!");
      setShowSuccess(true);
    })
  }

  const PostSection = ({postInfo}) => {
    const removePost = () => {
      axios.post(`${url}/post/removepost`, {
        token: localStorage.getItem('token'),
        post_id: postInfo.post_id
      }).then(res=> {
        let temp = [...posts];
        temp = temp.filter(post => post.post_id !== postInfo.post_id);
        setPosts(temp);
        setPageCount(Math.ceil(temp.length / pageSize))
        let p = page;
        if (page > Math.ceil(temp.length / pageSize)) {
          setPage(page - 1);
          p = p-1
        }
        const start1 = (p-1)*pageSize;
        const end1 = p * pageSize;
        setPagePosts(temp.slice(start1, end1));
      })
    }

    return (
      <FeedListing post={postInfo} username={values.username} avatar={values.avatar} id={values.user_id} removePost={removePost} isSelf={isSelf} />
    )
  };

  return (
    <>
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError} />
      <SuccessPopup successMsg={successMsg} snackBarOpen={showSuccess} setSnackBarOpen={setShowSuccess} />
      {isSelf ?
        <Button
          onClick={handleAddPost}
          variant="outlined"
          sx={{marginBottom: '10px'}}
        >
          Add Post
        </Button>
        : null}
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
              <TextField
                variant="outlined"
                fullWidth
                label=""
                id="fullWidth"
                multiline={true}
                onChange={handleChange}
                rows={12}
              />
            </Box>
            <Button onClick={handleAddPostClose}>Cancel</Button>
            <Button onClick={handleSubmitPost}>Submit</Button>
          </Grid>

        </Box>
      </Dialog>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {pagePosts.map(postInfo => {
          return (
            <Box key={postInfo.post_id} sx={{marginBottom: '10px', width: '100%'}}>
              <PostSection postInfo={postInfo}/>
            </Box>
          )
        })}
        {posts.length === 0 ? <h2>There is no post here.</h2> : null}
        <Pagination sx={{marginBottom: '10px'}} count={pageCount} page={page} onChange={handleChangePage} />
      </Box>
    </>
  );
};
export default Posts;