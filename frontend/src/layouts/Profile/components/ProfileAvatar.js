import React, { useState, useEffect } from 'react';
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
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";

export const ProfileAvatar = ({userInfo, updateUserInfo}) => {
  const urlParams = useParams();
  const [isSelf, setIsSelf] = useState(true);
  const [values, setValues] = useState({});
  const [showFollowers, setShowFollowers] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [showFollowings, setShowFollowings] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const user_id = Number(window.location.pathname.split('/')[2]);
  
  useEffect(() => {
    // get profile
    setIsSelf(user_id === userInfo.user_id);
    axios.get(`${url}/user/profile`, {params: {
      user_id: user_id,
      token: localStorage.getItem('token')
    }})
    .then(function (res) {
      if (user_id === userInfo.user_id)
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
    // get follower list
    axios.get(`${url}/user/getfollower`, {params: {
      user_id: user_id
    }}).then(function (response) {
      console.log(user_id)
      console.log(response.data.followers);
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

  }, [window.location.href, userInfo])


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
      setErrorMsg(JSON.stringify(error.message));
      setShowError(true);
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

  /////////////////////Upload Avatar///////////////////////

  function onImageChange(e) {
    setSelected('');
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
      setSelected(reader.result);
    }
  }

  const uploadAvatar = () => {
    if (selected.length === 0) {
      setShowError(true);
      setErrorMsg("Please choose an image to upload");
    }
    axios.post(`${url}/user/updateavatar`, {
      token: localStorage.getItem('token'),
      avatar: selected
    }).then(res => {
      updateUserInfo({
        ...userInfo,
        ['avatar']: selected,
      })
      localStorage.setItem('user', JSON.stringify({
        user_id: userInfo.user_id,
        email: userInfo.email,
        username: userInfo.username,
        password: userInfo.password,
        avatar: selected
      }))
      setShowSuccess(true);
      setSuccessMsg("Upload avatar success!");
      handleClose();
    }).catch(error => {
      setErrorMsg(JSON.stringify(error.message));
      setShowError(true);
    })
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSelected('');
    setOpen(false);
  };
  ///////////////////////////////////////////////////////////

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
            {isSelf ? <Button onClick={handleOpen} color="primary" variant='contained'>
                Upload Avatar
              </Button>
              : <>{isFollowing ? <UnfollowButton id={user_id} username={values.username} isFollowing={isFollowing} setIsFollowing={setIsFollowing} setShowError={setShowError} setShowSuccess={setShowSuccess} setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg}/>
                : <FollowButton id={user_id} username={values.username} isFollowing={isFollowing} setIsFollowing={setIsFollowing} setShowError={setShowError} setShowSuccess={setShowSuccess} setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg}/>}
              </>}
          </Box>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Upload Avatar</DialogTitle>
            <DialogContent>
              <input
                type="file"
                id="upload"
                accept='image/*'
                onChange={onImageChange}
              />
              {selected === '' ?
                null
                :
                <div style={{marginTop: '10px'}}>
                  <Avatar
                    src={selected}
                    sx={{
                      height: 150,
                      mb: 2,
                      width: 150
                    }}
                  />
                </div>
              }
            </DialogContent>
            <DialogActions>
              <Button
                variant='outlined'
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={uploadAvatar}
                sx={{textTransform: 'none'}}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
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