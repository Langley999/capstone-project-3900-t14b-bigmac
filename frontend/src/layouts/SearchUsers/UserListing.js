import React, { useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import UsernameLink from '../../components/UsernameLink';
import FollowButton from '../../components/FollowButton';
import UnfollowButton from '../../components/UnfollowButton';

const UserListing = ({ searchedUser, isFollowing, setSuccessMsg, setShowSuccess, setErrorMsg, setShowError }) => {
  const [isFollowingState, setIsFollowingState] = useState(isFollowing);

  const listingStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }

  // make user profile link into component with userid and username as params
  return (
    <Card style={{width: "1000px", margin: "auto"}}>
      <CardContent style={listingStyle}>
        <UsernameLink username={searchedUser.username} id={searchedUser.user_id} avatar={searchedUser.avatar} />
        {isFollowing ?
        <UnfollowButton id={searchedUser.user_id} username={searchedUser.username} isFollowing={isFollowingState} setIsFollowing={setIsFollowingState} setShowError={setShowError} setShowSuccess={setShowSuccess} setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg}/>
        : <FollowButton id={searchedUser.user_id} username={searchedUser.username} isFollowing={isFollowingState} setIsFollowing={setIsFollowingState} setShowError={setShowError} setShowSuccess={setShowSuccess} setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg}/>}
      </CardContent>
    </Card>
  )
}

export default UserListing;