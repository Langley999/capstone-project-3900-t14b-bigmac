import React, { useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar} from '@mui/material';
import Button from '@mui/material/Button';

const SearchUsers = ({searchResult}) => {
  // {userInfo.avatar === undefined ?
  //   <Avatar fontSize="large"/> :
  //   <Avatar
  //     src={userInfo.avatar}
  //     sx={{
  //       height: 45,
  //       mb: 0,
  //       width: 45
  //     }}
  //   />
  // }
  const listingStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }

  const User = ({ username, user_id, avatar, isFollowing, url }) => {
    const followUser = () => {

    }

    const unfollowUser = () => {
      
    }
    // make user profile link into component with userid and username as params
    return (
      <Card style={{width: "1000px", margin: "auto"}}>
        <CardContent style={listingStyle}>
          <div style={{display: "flex",flexDirection: "row"}}>
            <Avatar fontSize="large"/>
            <Button href="#text-buttons" style={{textTransform: "none"}}>{username}</Button>
          </div>
          {isFollowing ?
          <Button onClick={unfollowUser} variant="contained">Unfollow</Button>
          : <Button onClick={followUser} variant="outlined">Follow</Button>}
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      {searchResult.length > 0 ? searchResult.map((userInfo) => {
        return (
          <User />
        )
      }) : <div style={{paddingTop: "50px"}}>There were no books that match that phrase</div>}
    </div>
  );
};
export default SearchUsers;