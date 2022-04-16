import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import UsernameLink from '../../components/UsernameLink';
import FollowButton from '../../components/FollowButton';
import UnfollowButton from '../../components/UnfollowButton';

/**
 * UserListing returns a card that includes user's avatar, clickable username link that
 * redirects to their profile and a follow/unfollow button
 * @param {Object} searchedUser contains avatar, id, username, isFollowing
 * @returns Card with user information
 */
const UserListing = ({ searchedUser, setSuccessMsg, setShowSuccess, setErrorMsg, setShowError }) => {
  const [isFollowing, setIsFollowing] = React.useState(searchedUser.isFollowing);

  const listingStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }

  return (
    <Card style={{width: '1000px', margin: 'auto'}}>
      <CardContent style={listingStyle}>
        <UsernameLink username={searchedUser.username} id={searchedUser.user_id} avatar={searchedUser.avatar} />
        {isFollowing ? <UnfollowButton id={searchedUser.user_id} username={searchedUser.username} isFollowing={isFollowing} setIsFollowing={setIsFollowing} setShowError={setShowError} setShowSuccess={setShowSuccess} setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg}/>
          : <FollowButton id={searchedUser.user_id} username={searchedUser.username} isFollowing={isFollowing} setIsFollowing={setIsFollowing} setShowError={setShowError} setShowSuccess={setShowSuccess} setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg}/>}
      </CardContent>
    </Card>
  )
}

export default UserListing;