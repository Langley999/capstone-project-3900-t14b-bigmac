import {Avatar, Badge, Box, IconButton, Toolbar, Tooltip} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import AppBar from '@mui/material/AppBar';
import HelpIcon from '@mui/icons-material/Help';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import {useState} from "react";

const HeaderContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[3],
  color: 'grey',
}));

const Slogan = styled('h1')(({ theme }) => ({
  color: '#22447b',
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

function Header () {
  const [radioValue, setRadioValue] = useState('by title');
  const [searchValue, setSearchValue] = useState('');

  const onChangeRadio = (e) => {
    setRadioValue(e.target.value);
  }

  function NavBarV1 () {
    return (
      <>
        <Button color="inherit">Login</Button>
        <Button color="inherit">Register</Button>
      </>
    )
  }

  function NavBarV2 () {
    return (
      <>
        <Tooltip title="Quiz">
          <IconButton sx={{ ml: 1 }}>
            <HelpIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Feed">
          <IconButton sx={{ ml: 1 }}>
            <RssFeedIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Search Users">
          <IconButton sx={{ ml: 1 }}>
            <GroupIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Notifications">
          <IconButton sx={{ ml: 1 }}>
            <NotificationsIcon fontSize="large"/>
          </IconButton>
        </Tooltip>
        <Avatar
          sx={{
            height: 40,
            width: 40,
            ml: 1
          }}
        >
          <AccountCircleIcon fontSize="large" />
        </Avatar>
      </>
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
          <Slogan>BookStation</Slogan>
          <Box component="form" onSubmit={()=>console.log(searchValue)}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                onChange={(e) => setSearchValue(e.target.value)}
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
              <FormControlLabel value="female" control={<Radio />} label="by title" />
              <FormControlLabel value="male" control={<Radio />} label="by author" />
            </RadioGroup>
          </FormControl>
          <Button variant="contained">Filter</Button>
          <Box sx={{ flexGrow: 1 }} />
          <NavBarV2/>
        </Toolbar>
      </HeaderContainer>

  );
}

export default Header