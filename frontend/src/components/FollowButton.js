import Button from '@mui/material/Button';
import axios from 'axios';
import {url} from './Helper';

/**
 * @returns a button that sends post request to follow a user if it is clicked
 */
const FollowButton = ({searchUser, followerCount, setFollowerCount, id, username, isFollowing, setIsFollowing, setShowError, setShowSuccess, setSuccessMsg, setErrorMsg}) => {
  
  const followUser = () => {
    axios.post(`${url}/user/follow`, {
      token: localStorage.getItem('token'),
      user_id: id
    })
    .then(res => {
      if (res['status'] === 200) {
        setSuccessMsg(`Followed ${username}!`);
        setShowSuccess(true);
        if (searchUser) searchUser();

        // set following to true, initially false
        if (setIsFollowing) setIsFollowing(!isFollowing);

        // increment follower count of current user if setFollowerCount is given
        if (setFollowerCount) setFollowerCount(followerCount+1);
      }
    })
    .catch(function (error) {
      setErrorMsg(error.response.data.message);
      setShowError(true);
    });
  }

  return (
    <Button onClick={followUser} variant='outlined'>Follow</Button>
  )
}

export default FollowButton;