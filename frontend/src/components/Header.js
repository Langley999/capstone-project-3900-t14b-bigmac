import {Avatar, Badge, Box, Divider, IconButton, Toolbar, Tooltip} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import HelpIcon from '@mui/icons-material/Help';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import React, {useEffect, useState} from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeIcon from '@mui/icons-material/Home';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import Genres from "./Genres";
import Filter from "./Filter";
import axios from "axios";
import {url} from './Helper';
import '../App.css';
import InputAdornment from "@mui/material/InputAdornment";
import {TextField} from "@material-ui/core";
import { withSnackbar } from 'notistack';
import { useSnackbar } from 'notistack';
import ErrorPopup from './ErrorPopup';

const HeaderContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[3],
  color: 'grey',
}));

const Slogan = styled('h1')(({ theme }) => ({
  color: '#6985c4',
}));


function Header ({ ifLogin, updateLogin, userInfo, searchValue, updateSearchValue, radioValue, updateRadioValue, updateSearchResult, updateTabValue, searchRating, updateSearchRating, updatePageCount, updatePage, updateSearchType, updateGenreRating, updateSearchGenres, updateTempsearchRating, updateNewNotif}) {
  const [rating, setRating] = useState(0);
  const [toRead, setToRead] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(()=>{

    let myInterval = setInterval(() => {
      if (localStorage.getItem('token')) {
        axios.get(`${url}/notification/checknew`, {
          params: {
            token: localStorage.getItem('token')
          }
        }).then(res => {
          if (location.pathname === "/notifications" && toRead !== 0) {
            setToRead(0);
          } else {
            setToRead(toRead + res.data.to_read);
          }
          if (res.data.to_read > 0) {
            updateNewNotif(res.data);
            addNotifPopup(res.data.to_read);
          }
        })
      }
    }, 2000)
    return () => {
      clearInterval(myInterval);
    };
  });

  const addNotifPopup = (to_read) => {
    // get all notifications
    axios.get(`${url}/notification/getall`, {
      params: {
        token: localStorage.getItem('token')
      }
    }).then(response => {
      console.log(response.data.notifications);
      
      // show notification popups
      const notifHistory = response.data.notifications;
      for (let i = 0; i < to_read; i++) {
        if (notifHistory[i].type === 'post') {
          const action = key => (
            <Button onClick={() => {navigate('/feed');closeSnackbar(key)}} style={{color: 'white'}} >Your Feed</Button>
          );
          enqueueSnackbar(` ${notifHistory[i].sender_name} just posted to your feed`, {variant: 'info', autoHideDuration: 4000, action});
        } else if (notifHistory[i].type === 'review') {
          const action = key => (
            <Button onClick={() => {navigate(`/book/?id=${notifHistory[i].book_id}`);closeSnackbar(key)}} style={{color: 'white'}} >Book Page</Button>
          )
          enqueueSnackbar(` ${notifHistory[i].sender_name} just reviewed a book`, {variant: 'success', autoHideDuration: 4000, action});
        } else if (notifHistory[i].type === 'follow') {
          const action = key => (
            <Button onClick={() => {navigate(`/user/${notifHistory[i].sender_id}/profile`);closeSnackbar(key);}} style={{color: 'white'}} >Their Profile</Button>
          )
          enqueueSnackbar(` ${notifHistory[i].sender_name} just followed your account`, {variant: 'warning', autoHideDuration: 4000, action});
        }
      }
    });
  }

  const updateRating = (rating) => {
    setRating(rating);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const onChangeRadio = (e) => {
    updateRadioValue(e.target.value);
  }

  const submitSearch = (e) => {
    e.preventDefault();
    axios.get(`${url}/search/searchbook`, {params: {
        type: radioValue,
        value: searchValue,
        rating: searchRating,
        page: 1
    }})
    .then(res => {
      updatePage(1);
      updateTempsearchRating(searchRating);
      updateSearchRating(0);
      updateSearchType('byValue');
      updatePageCount(res.data.pages);
      updateSearchResult(res.data.books);
      setRating(0);
      navigate('searchbooks');
    })
    .catch(function (error) {
      setErrorMsg(error.response.data.message);
      setShowError(true);
    });
  }

  const PublicFeedIcon = () => {
    return (
      <Tooltip title="Public Feed">
        <IconButton sx={{ ml: 1 }} component={Link} to='publicfeed'>
          <DynamicFeedIcon fontSize="large"/>
        </IconButton>
      </Tooltip>
    )
  }

  function NavBarV1 () {
    return (
      <>
        <PublicFeedIcon/>
        <Button color="inherit" component={Link} to='/bookstation/login'>Login</Button>
        <Button color="inherit" component={Link} to='/bookstation/register'>Register</Button>
      </>
    )
  }

  function NavBarV2 () {
    return (
      <>
        <PublicFeedIcon/>
        <Tooltip title="Quiz">
          <IconButton sx={{ ml: 1 }} component={Link} to='quiz'>
            <HelpIcon fontSize="large"/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Feed">
          <IconButton sx={{ ml: 1 }} component={Link} to='feed'>
            <RssFeedIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Search Users">
          <IconButton sx={{ ml: 1 }}  component={Link} to='users'>
            <GroupIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Notifications">
          <IconButton sx={{ ml: 1 }} component={Link} to='notifications' onClick={() => {setToRead(0)}} >
            <Badge badgeContent={toRead} color="primary">
              <NotificationsIcon fontSize="large"/>
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title='Home'>
          <IconButton sx={{ ml: 1 }} component={Link} to='/'>
            <HomeIcon fontSize="large"/>
          </IconButton>
        </Tooltip>
      </>
    )
  }

  const Dropdown = () => {
    const submitLogout = () => {
      axios.post(`${url}/auth/logout`, {
        email: userInfo.email,
        token: localStorage.getItem('token')
      }).then(res => {
        updateLogin(false);
        localStorage.clear();
        navigate('/');
      })
    }

    return (
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 90,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <MenuItem component={Link} to={`/user/${userInfo.user_id}/profile`} onClick={() => updateTabValue(0)}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem component={Link} to={`/user/${userInfo.user_id}/collections`} onClick={() => updateTabValue(1)}>
          <ListItemIcon>
            <CollectionsBookmarkIcon fontSize="small" />
          </ListItemIcon>
          Collections
        </MenuItem>
        <MenuItem component={Link} to={`/user/${userInfo.user_id}/posts`} onClick={() => updateTabValue(2)}>
          <ListItemIcon>
            <AutoFixHighIcon fontSize="small" />
          </ListItemIcon>
          Posts
        </MenuItem>
        <MenuItem component={Link} to={`/user/${userInfo.user_id}/analytics`} onClick={() => updateTabValue(3)}>
          <ListItemIcon>
            <BarChartIcon fontSize="small" />
          </ListItemIcon>
          Analytics
        </MenuItem>
        <Divider/>
        <MenuItem onClick={submitLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    )
  }


  return (
    <>
      <ErrorPopup errorMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError}/>
      <HeaderContainer position="fixed" className='header'
        sx={{
          width: {
            lg: '100%'
          }
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <Box component={Link} to='/' className='remove-underline' sx={{color: '#6985c4'}} >
            <Slogan >
              BookStation
            </Slogan>
          </Box>
          <Box
            sx={{marginLeft: '10px', marginRight: '10px'}}
            component="form"
            onSubmit={(e) => submitSearch(e)}
          >
            <TextField
              size="small"
              placeholder="Search Books"
              value={searchValue}
              onChange={(e) => updateSearchValue(e.target.value)}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" color="primary">
                      <SearchIcon onClick={(e) =>submitSearch(e)}/>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <FormControl>
            <RadioGroup
              aria-labelledby="radio-buttons"
              name="radio-buttons"
              value={radioValue}
              onChange={onChangeRadio}
            >
              <FormControlLabel value="title" control={<Radio />} label="by title" />
              <FormControlLabel value="author" control={<Radio />} label="by author" />
            </RadioGroup>
          </FormControl>
          <Filter updateSearchRating={updateSearchRating} updateRating={updateRating} rating={rating}/>
          <Divider
            orientation="vertical"
            style={{ minHeight: "inherit", color: "red", marginLeft: '20px', marginRight: '20px'}}
          />
          <Genres updateSearchResult={updateSearchResult} updateGenreRating={updateGenreRating} updateSearchType={updateSearchType} updateSearchGenres={updateSearchGenres} updatePageCount={updatePageCount} updatePage={updatePage}/>
          <Box sx={{ flexGrow: 1 }} />
          {ifLogin ? <NavBarV2/> : <NavBarV1/>}
          {ifLogin ?
            <div>
              <Tooltip title="profile">
                <IconButton
                  sx={{ml: 1}}
                  onClick={handleClick}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  {userInfo.avatar === undefined ?
                    <Avatar fontSize="large"/> :
                    <Avatar
                      src={userInfo.avatar}
                      sx={{
                        height: 45,
                        mb: 0,
                        width: 45
                      }}
                    />
                  }
                </IconButton>
              </Tooltip>
              <span style={{fontSize: "20px"}}>&nbsp;&nbsp;{userInfo.username}</span>
            </div>  : null
          }
          <Dropdown/>
        </Toolbar>
        <ErrorPopup errorMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError} />
      </HeaderContainer>
    </>
  );
}

export default withSnackbar(Header);