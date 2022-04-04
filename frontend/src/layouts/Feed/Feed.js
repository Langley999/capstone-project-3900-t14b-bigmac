import React, { useState, useRef } from 'react';
import ErrorPopup from '../../components/ErrorPopup';
import FeedListing from './FeedListing';
import axios from "axios";
import {url} from '../../components/Helper';
import Pagination from '@mui/material/Pagination';

const Feed = () => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const [feed, updateFeed] = React.useState([]);
  const [pagePosts, setPagePosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(10);
  const pageSize = 10;

  React.useEffect(() => {
    getFeed();
  }, []);

  const getFeed = () => {
    axios.get(`${url}/post/getfeed`, {params: {
      token: localStorage.getItem('token'),
      page: 1
    }})
    .then(res => {
      console.log(res.data.posts);
      updateFeed(res.data.posts);
      setPage(1);
      setPageCount(Math.ceil(res.data.posts.length / pageSize));
      setPagePosts(res.data.posts.slice(0, pageSize));
    })
    .catch(function (error) {
      setErrorMsg(error.response.data.message);
      setShowError(true);
    });
  }

  const handleChangePage = (event, value) => {
    setPage(value);
    const start = (value-1)*pageSize;
    const end = value * pageSize;
    setPagePosts(feed.slice(start, end));
  }

  return (
    <div>
      <ErrorPopup successMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError} />
      <h1 style={{height: '40px'}}>Feed</h1>
      {pagePosts.length > 0 ? pagePosts.map((post) => {
        return (
          <FeedListing post={post}/>
        )
      }) : <div style={{paddingTop: "50px", textAlign:"vertical"}}>Follow other users to see their posts</div>}
      {feed.length > 0 ? <Pagination sx={{margin: '20px'}} count={pageCount} page={page} onChange={handleChangePage} /> : <></>}
    </div>
  );
};
export default Feed;