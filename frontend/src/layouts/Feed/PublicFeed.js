import React, { useState, useRef } from 'react';
import SuccessPopup from '../../components/SuccessPopup';
import ErrorPopup from '../../components/ErrorPopup';
import FeedListing from './FeedListing';
import axios from "axios";
import {url} from '../../components/Helper';

const PublicFeed = () => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [showError, setShowError] = React.useState(false);

  const [feed, updateFeed] = React.useState([]);

  React.useEffect(() => {
    getPublicFeed();
  }, []);

  const getPublicFeed = () => {
    axios.get(`${url}/post/getpublicfeed`, {params: {}})
    .then(res => {
      updateFeed(res.data.posts);
    })
    .catch(function (error) {
      setErrorMsg(error.response.data.message);
      setShowError(true);
    });
  }
  
  return (
    <div>
      <ErrorPopup successMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError} />
      <h1>Public Feed</h1>
      {feed.length > 0 ? feed.map((post) => {
        return (
          <FeedListing post={post}/>
        )
      }) : <div style={{paddingTop: "50px", textAlign:"vertical"}}>No one has posted yet</div>}
    </div>
  );
};
export default PublicFeed;