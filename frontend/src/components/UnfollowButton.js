import Button from '@mui/material/Button';
import axios from "axios";
import {url} from './Helper';

const FollowButton = ({id, username, isFollowing, setIsFollowing, setShowError, setShowSuccess, setSuccessMsg, setErrorMsg}) => {
  const unfollowUser = () => {
    axios.post(`${url}/user/unfollow`, {
      token: localStorage.getItem('token'),
      user_id: id
    })
    .then(res => {
      if (res['status'] === 200) {
        setSuccessMsg(`Unfollowed ${username}!`);
        setShowSuccess(true);
        setIsFollowing(!isFollowing);
      }
    })
    .catch(function (error) {
      setErrorMsg(error.response.data.message);
      setShowError(true);
    });
  }

  return (
    <Button onClick={unfollowUser} variant="contained">Unfollow</Button>
  )
}

export default FollowButton;