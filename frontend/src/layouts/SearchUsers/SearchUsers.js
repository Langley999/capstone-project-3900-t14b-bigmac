import React from 'react';
import UserListing from './UserListing';
import ErrorPopup from '../../components/ErrorPopup';
import SuccessPopup from '../../components/SuccessPopup';
import axios from "axios";
import {url} from '../../components/Helper';
import {Box, TextField} from '@mui/material';
import Button from '@mui/material/Button';

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
        setErrorMsg(error.message);
        showError(true);
      });
  }

  const handleChangeSearchUser = (event) => {
    setSearchValue(event.target.value);
    console.log(event.target.value);
  }

  return (
    <div>
      <SuccessPopup successMsg={successMsg} snackBarOpen={showSuccess} setSnackBarOpen={setShowSuccess} />
      <ErrorPopup successMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError} />
      <div style={{display: "flex", flexDirection: "row", margin: "30px", marginLeft: "5px"}}>
        <Box component="form">
          <TextField
            placeholder="Search Users"
            value={searchValue}
            onChange={handleChangeSearchUser}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Box>
        <Button onClick={searchUser} variant="contained" sx={{marginLeft: '10px'}}>Search</Button>
      </div>
      {users.length > 0 ? users.map((searchedUser) => {
        return (
          <UserListing searchedUser={searchedUser} setSuccessMsg={setSuccessMsg} setShowSuccess={setShowSuccess} setErrorMsg={setErrorMsg} setShowError={setShowError}/>
        )
      }) : <div style={{paddingTop: "50px", textAlign:"vertical"}}>There were no usernames that matched the phrase "{searchValue}"</div>}
    </div>
  );
};
export default SearchUsers;