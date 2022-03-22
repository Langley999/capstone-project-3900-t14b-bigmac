import React, { useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import axios from "axios";
import {url} from '../../components/Helper';
import UsernameLink from '../../components/UsernameLink';

const UserListing = ({ searchedUser, setSuccessMsg, setShowSuccess, setErrorMsg, setShowError }) => {
  const [isFollowing, setIsFollowing] = useState(searchedUser.isFollowing);

  const listingStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }

  const followUser = () => {
    axios.post(`${url}/user/follow`, {
      token: localStorage.getItem('token'),
      user_id: searchedUser.user_id
    })
    .then(res => {
      if (res['status'] === 200) {
        setSuccessMsg(`Followed ${searchedUser.username}!`);
        setShowSuccess(true);
        setIsFollowing(!isFollowing);
      }
    })
    .catch(function (error) {
      setErrorMsg(error.response.data.message);
      setShowError(true);
    });
  }

  const unfollowUser = () => {
    axios.post(`${url}/user/unfollow`, {
      token: localStorage.getItem('token'),
      user_id: searchedUser.user_id
    })
    .then(res => {
      if (res['status'] === 200) {
        setSuccessMsg(`Unfollowed ${searchedUser.username}!`);
        setShowSuccess(true);
        setIsFollowing(!isFollowing);
      }
    })
    .catch(function (error) {
      setErrorMsg(error.response.data.message);
      setShowError(true);
    });
  }
  // make user profile link into component with userid and username as params
  return (
    <Card style={{width: "1000px", margin: "auto"}}>
      <CardContent style={listingStyle}>
        <UsernameLink username={searchedUser.username} id={searchedUser.user_id} avatar={searchedUser.avatar} />
        {isFollowing ?
        <Button onClick={unfollowUser} variant="contained">Unfollow</Button>
        : <Button onClick={followUser} variant="outlined">Follow</Button>}
      </CardContent>
    </Card>
  )
}

export default UserListing;