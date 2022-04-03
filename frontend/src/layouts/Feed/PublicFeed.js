import React, { useState, useRef } from 'react';
import ErrorPopup from '../../components/ErrorPopup';
import FeedListing from './FeedListing';
import axios from "axios";
import {url} from '../../components/Helper';
import Pagination from '@mui/material/Pagination';

const PublicFeed = () => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const [feed, updateFeed] = React.useState([]);
  const [pagePosts, setPagePosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(10);
  const pageSize = 10;

  React.useEffect(() => {
    getPublicFeed();
  }, []);

  const getPublicFeed = () => {
    axios.get(`${url}/post/getpublicfeed`, {params: {
      page: 1
    }})
    .then(res => {
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
      <h1>Public Feed</h1>
      {feed.length > 0 ? feed.map((post) => {
        return (
          <FeedListing post={post} isPublic={localStorage.getItem('token') ? false : true}/>
        )
      }) : <div style={{paddingTop: "50px", textAlign:"vertical"}}>No one has posted yet</div>}
      <Pagination sx={{marginBottom: '10px'}} count={pageCount} page={page} onChange={handleChangePage} />
    </div>
  );
};
export default PublicFeed;