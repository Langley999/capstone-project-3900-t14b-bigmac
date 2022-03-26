import { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
} from '@mui/material';
import {useParams} from "react-router-dom";
import axios from "axios";
import {url} from "../../../components/Helper";
import FollowerPopup from './FollowerPopup';
import FollowingPopup from './FollowingPopup';
import ErrorPopup from '../../../components/ErrorPopup';
import SuccessPopup from '../../../components/SuccessPopup';
import FollowButton from '../../../components/FollowButton';
import UnfollowButton from '../../../components/UnfollowButton';

export const ProfileAvatar = ({userInfo, updateUserInfo}) => {
  const urlParams = useParams();
  const user_id = Number(urlParams.userid);
  const [isSelf, setIsSelf] = useState(user_id === userInfo.user_id);
  const [values, setValues] = useState({});
  const [showFollowers, setShowFollowers] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [showFollowings, setShowFollowings] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  useEffect(() => {
    getProfile();
    // get follower list
    axios.get(`${url}/user/getfollower`, {params: {
      user_id: user_id
    }}).then(function (response) {
      setFollowers(response.data.followers);
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.message));
      setShowError(true);
    });
    // get following list
    axios.get(`${url}/user/getfollowing`, {params: {
      token: localStorage.getItem('token'),
      user_id: user_id
    }}).then(function (response) {
      setFollowings(response.data.followings);
    }).catch(function (error) {
      setErrorMsg(JSON.stringify(error.message));
      setShowError(true);
    });

  }, [])

  const getProfile = () => {
    axios.get(`${url}/user/profile`, {params: {
      user_id: user_id,
      token: localStorage.getItem('token')
    }})
    .then(function (res) {
      if (isSelf)
        setValues(userInfo);
      else {
        setValues({
          username: res.data.username,
          avatar: res.data.avatar
        });
        setIsFollowing(res.data.isFollowing);
      }
    })
    .catch(function (error) {
      alert(error.response.data.message)
    });
  }

  const getFollowers = () => {
    axios.get(`${url}/user/getfollower`, {params: {
      user_id: user_id,
      token: localStorage.getItem('token')
    }}).then(function (response) {
      setFollowers(response.data.followers);
      setShowFollowers(true);
    }).catch(function (error) {
      // show error message if goal cannot be retrieved
      setErrorMsg(JSON.stringify(error.message));
      setShowError(true);
    });
  }

  const getFollowings = () => {
    axios.get(`${url}/user/getfollowing`, {params: {
      user_id: user_id,
      token: localStorage.getItem('token')
    }}).then(function (response) {
      setFollowings(response.data.followings);
      setShowFollowings(true);
    }).catch(function (error) {
      // show error message if goal cannot be retrieved
      setErrorMsg(JSON.stringify(error.message));
      setShowError(true);
    });
  }

  return (
    <div>
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError} />
      <SuccessPopup successMsg={successMsg} snackBarOpen={showSuccess} setSnackBarOpen={setShowSuccess} />
      <Card>
        <CardContent>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Avatar
              src={values.avatar}
              sx={{
                height: 150,
                mb: 2,
                width: 150
              }}
            />
          </Box>
          {isSelf ? <Button color="primary" variant='contained'>
              Upload Avatar
            </Button>
            : <>{isFollowing ? <UnfollowButton id={user_id} username={values.username} isFollowing={isFollowing} setIsFollowing={setIsFollowing} setShowError={setShowError} setShowSuccess={setShowSuccess} setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg}/>
            : <FollowButton id={user_id} username={values.username} isFollowing={isFollowing} setIsFollowing={setIsFollowing} setShowError={setShowError} setShowSuccess={setShowSuccess} setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg}/>}
          </>}
        </CardContent>
        <CardActions>
        </CardActions>
        <Divider />
        <Button
          color='warning'
          fullWidth
          variant="text"
          sx={{textTransform: "none"}}
          onClick={getFollowings}
        >
          {followings.length} followings
        </Button>
        <Button
          fullWidth
          variant="text"
          sx={{textTransform: "none"}}
          onClick={getFollowers}
        >
          {followers.length} followers
        </Button>
      </Card>
      {showFollowers ? <FollowerPopup followers={followers} setShowFollowers={setShowFollowers} getProfile={getProfile}/> : <></>}
      {showFollowings ? <FollowingPopup followings={followings} setShowFollowings={setShowFollowings} getProfile={getProfile}/> : <></>}
    </div>
  )
}