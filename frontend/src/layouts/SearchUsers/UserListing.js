import React, { useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar} from '@mui/material';
import Button from '@mui/material/Button';
import axios from "axios";
import {url} from '../../components/Helper';
import {Link} from "react-router-dom";

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
        <div style={{display: "flex",flexDirection: "row"}}>
          {searchedUser.avatar === undefined ?
          <Avatar fontSize="large"/> :
          <Avatar
            src={searchedUser.avatar}
            sx={{
              height: 45,
              mb: 0,
              width: 45
            }}
          />}
          <Button component = {Link} to={`/user/${searchedUser.user_id}/profile`} style={{textTransform: "none"}}>{searchedUser.username}</Button>
        </div>
        {isFollowing ?
        <Button onClick={unfollowUser} variant="contained">Unfollow</Button>
        : <Button onClick={followUser} variant="outlined">Follow</Button>}
      </CardContent>
    </Card>
  )
}

export default UserListing;