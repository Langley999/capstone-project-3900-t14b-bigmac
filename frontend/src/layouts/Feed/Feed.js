import React, { useState, useRef } from 'react';
import SuccessPopup from '../../components/SuccessPopup';
import ErrorPopup from '../../components/ErrorPopup';
import FeedListing from './FeedListing';
import axios from "axios";
import {url} from '../../components/Helper';

const Feed = () => {
  const [successMsg, setSuccessMsg] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  const [feed, updateFeed] = React.useState([]);

  React.useEffect(() => {
    getFeed();
  }, []);

  const getFeed = () => {
    axios.get(`${url}/post/getfeed`, {params: {
      token: localStorage.getItem('token'),
    }})
    .then(res => {
      updateFeed(res.data.posts);
      console.log(res.data.posts);
    })
    .catch(function (error) {
      setErrorMsg(error.response.data.message);
      setShowError(true);
    });
  }
  
  return (
    <div>
      <SuccessPopup successMsg={successMsg} snackBarOpen={showSuccess} setSnackBarOpen={setShowSuccess} />
      <ErrorPopup successMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError} />
      <h1>Feed</h1>
      {feed.length > 0 ? feed.map((post) => {
        return (
          <FeedListing post={post}/>
        )
      }) : <div style={{paddingTop: "50px", textAlign:"vertical"}}>Follow other users to see their posts</div>}
    </div>
  );
};
export default Feed;