import Button from '@mui/material/Button';
import axios from "axios";
import {url} from './Helper';

const FollowButton = ({id, username, isFollowing, setIsFollowing, setShowError, setShowSuccess, setSuccessMsg, setErrorMsg}) => {
  const followUser = () => {
    axios.post(`${url}/user/follow`, {
      token: localStorage.getItem('token'),
      user_id: id
    })
      .then(res => {
        if (res['status'] === 200) {
          setSuccessMsg(`Followed ${username}!`);
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
    <Button onClick={followUser} variant="outlined">Follow</Button>
  )
}

export default FollowButton;