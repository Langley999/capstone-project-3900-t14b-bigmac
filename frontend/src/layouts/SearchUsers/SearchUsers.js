import React from 'react';
import UserListing from './UserListing';
import ErrorPopup from '../../components/ErrorPopup';
import SuccessPopup from '../../components/SuccessPopup';
import axios from "axios";
import {url} from '../../components/Helper';
import {Box} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const SearchUsers = () => {
  const [successMsg, setSuccessMsg] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');

  React.useEffect(() => {
    searchUser();
  }, []);

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

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

  const searchUser = () => {
    // show user search results
    axios.get(`${url}/user/search`, {params: {
      token: localStorage.getItem('token'),
      search_phrase: searchValue
    }})
    .then(res => {
      setUsers(res.data.users);
    })
    .catch(function (error) {
      setErrorMsg(error.response.data.message);
      showError(true);
    });
  }

  return (
    <div>
      <SuccessPopup successMsg={successMsg} snackBarOpen={showSuccess} setSnackBarOpen={setShowSuccess} />
      <ErrorPopup successMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError} />
      <div style={{display: "flex", flexDirection: "row", margin: "30px", marginLeft: "5px"}}>
        <Box component="form">
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Users"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Box>
        <Button onClick={searchUser} variant="contained" sx={{marginLeft: '10px'}}>Search</Button>
      </div>
      {users.length > 0 ? users.map((searchedUser) => {
        return (
          <UserListing searchedUser={searchedUser} isFollowing={searchedUser.isFollowing} setSuccessMsg={setSuccessMsg} setShowSuccess={setShowSuccess} setErrorMsg={setErrorMsg} setShowError={setShowError}/>
        )
      }) : <div style={{paddingTop: "50px", textAlign:"vertical"}}>There were no usernames that matched the phrase "{searchValue}"</div>}
    </div>
  );
};
export default SearchUsers;