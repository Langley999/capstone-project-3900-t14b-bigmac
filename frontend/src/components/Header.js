import {Avatar, Badge, Box, Divider, IconButton, Toolbar, Tooltip} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
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
import {useState} from "react";
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeIcon from '@mui/icons-material/Home';
<<<<<<< HEAD


// const StyledLink = styled(Link)`
//     text-decoration: none;
//
//     &:focus, &:hover, &:visited, &:link, &:active {
//       text-decoration: none;
//     }
// `;
=======
import axios from "axios";
import {url} from './Helper';
import { useNavigate } from 'react-router-dom';
import '../App.css';
>>>>>>> ready to demo

const HeaderContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[3],
  color: 'grey',
}));

const Slogan = styled('h1')(({ theme }) => ({
  color: '#6985c4',
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 3,
  color: 'grey',
  border: 1,
  backgroundColor: alpha('#9e9e9e', 0.1),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

<<<<<<< HEAD
function Header ({ ifLogin }) {
  const [radioValue, setRadioValue] = useState('by title');
  const [searchValue, setSearchValue] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
=======
function Header ({ ifLogin, updateLogin, userInfo, searchValue, updateSearchValue, radioValue, updateRadioValue, updateSearchResult }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
>>>>>>> ready to demo

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onChangeRadio = (e) => {
<<<<<<< HEAD
    setRadioValue(e.target.value);
=======
    console.log(e.target.value)
    updateRadioValue(e.target.value);
  }

  const submitSearch = () => {
    console.log(radioValue)
    console.log(searchValue)
    axios.get(`${url}/search/searchbook`, {params: {
        type: radioValue,
        value: searchValue
    }})
      .then(res => {
        updateSearchResult(res.data.books);
        navigate('searchbooks');
      })
      .catch(function (error) {
        alert(error.response.data.message);
      });
>>>>>>> ready to demo
  }

  function NavBarV1 () {
    return (
      <>
        <Button color="inherit" component={Link} to='/bookstation/login'>Login</Button>
        <Button color="inherit" component={Link} to='/bookstation/register'>Register</Button>
      </>
    )
  }

  function NavBarV2 () {
    return (
      <>
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
          <IconButton sx={{ ml: 1 }} component={Link} to='notifications'>
            <NotificationsIcon fontSize="large"/>
          </IconButton>
        </Tooltip>
<<<<<<< HEAD
=======
        <Tooltip title='Home'>
          <IconButton sx={{ ml: 1 }} component={Link} to='/'>
            <HomeIcon fontSize="large"/>
          </IconButton>
        </Tooltip>
>>>>>>> ready to demo
      </>
    )
  }

  const Dropdown = () => {
<<<<<<< HEAD
=======
    const submitLogout = () => {
      axios.post(`${url}/auth/logout`, {
        email: userInfo.email,
        token: localStorage.getItem('token')
      }).then(res => {
        updateLogin(false);
        navigate('/');
      })
    }

>>>>>>> ready to demo
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
              right: 20,
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
<<<<<<< HEAD
        <MenuItem component={Link} to='/'>
          <ListItemIcon>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          Home
        </MenuItem>
=======
>>>>>>> ready to demo
        <MenuItem component={Link} to='/user/profile'>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem component={Link} to='/user/collections'>
          <ListItemIcon>
            <CollectionsBookmarkIcon fontSize="small" />
          </ListItemIcon>
          Collections
        </MenuItem>
        <MenuItem component={Link} to='/user/posts'>
          <ListItemIcon>
            <AutoFixHighIcon fontSize="small" />
          </ListItemIcon>
          Posts
        </MenuItem>
        <MenuItem component={Link} to='/user/analytics'>
          <ListItemIcon>
            <BarChartIcon fontSize="small" />
          </ListItemIcon>
          Analytics
        </MenuItem>
        <Divider/>
<<<<<<< HEAD
        <MenuItem>
=======
        <MenuItem onClick={submitLogout}>
>>>>>>> ready to demo
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    )
  }

  return (
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
<<<<<<< HEAD
          <Slogan>
              BookStation
          </Slogan>
          <Box component="form" onSubmit={()=>console.log(searchValue)}>
=======
          <Box component={Link} to='/' className='remove-underline' sx={{color: '#6985c4'}} >
            <Slogan >
                BookStation
            </Slogan>
          </Box>
          <Box component="form">
>>>>>>> ready to demo
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
<<<<<<< HEAD
                onChange={(e) => setSearchValue(e.target.value)}
=======
                value={searchValue}
                onChange={(e) => updateSearchValue(e.target.value)}
>>>>>>> ready to demo
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>
          <FormControl>
            <RadioGroup
              aria-labelledby="radio-buttons"
              name="radio-buttons"
              value={radioValue}
              onChange={onChangeRadio}
            >
<<<<<<< HEAD
              <FormControlLabel value="female" control={<Radio />} label="by title" />
              <FormControlLabel value="male" control={<Radio />} label="by author" />
            </RadioGroup>
          </FormControl>
          <Button
            variant="contained"

          >Filter</Button>
=======
              <FormControlLabel value="title" control={<Radio />} label="by title" />
              <FormControlLabel value="author" control={<Radio />} label="by author" />
            </RadioGroup>
          </FormControl>
          <Button variant="outlined">Filter</Button>
          <Button onClick={submitSearch} variant="contained" sx={{marginLeft: '10px'}}>Search</Button>
>>>>>>> ready to demo
          <Box sx={{ flexGrow: 1 }} />
          {ifLogin ? <NavBarV2/> : <NavBarV1/>}
          {ifLogin ?
            <Tooltip title="profile">
              <IconButton
                sx={{ml: 1}}
                onClick={handleClick}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
<<<<<<< HEAD
                {localStorage.getItem('userAvatar') === undefined ?
                  <Avatar fontSize="large"/> :
                  <Avatar
                    src={localStorage.getItem('userAvatar')}
=======
                {userInfo.avatar === undefined ?
                  <Avatar fontSize="large"/> :
                  <Avatar
                    src={userInfo.avatar}
>>>>>>> ready to demo
                    sx={{
                      height: 45,
                      mb: 0,
                      width: 45
                    }}
                  />
                }
              </IconButton>
            </Tooltip> : null
          }
          <Dropdown/>
        </Toolbar>
      </HeaderContainer>
  );
}

export default Header