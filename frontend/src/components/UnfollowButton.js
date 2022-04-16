import Button from '@mui/material/Button';
import axios from 'axios';
import {url} from './Helper';

/**
 * @returns a button that sends post request to unfollow a user if it is clicked
 */
const FollowButton = ({followerCount, setFollowerCount, id, username, isFollowing, setIsFollowing, setShowError, setShowSuccess, setSuccessMsg, setErrorMsg}) => {
  
  const unfollowUser = () => {
    axios.post(`${url}/user/unfollow`, {
      token: localStorage.getItem('token'),
      user_id: id
    })
    .then(res => {
      if (res['status'] === 200) {
        setSuccessMsg(`Unfollowed ${username}!`);
        setShowSuccess(true);

        // set following to false, initially true
        setIsFollowing(!isFollowing);

        // decrement follower count of current user if setFollowerCount is given
        if (setFollowerCount !== null) {
          setFollowerCount(followerCount-1);
        }
      }
    })
    .catch(function (error) {
      setErrorMsg(error.response.data.message);
      setShowError(true);
    });
  }

  return (
    <Button onClick={unfollowUser} variant='contained'>Unfollow</Button>
  )
}

export default FollowButton;