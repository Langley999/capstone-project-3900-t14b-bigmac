import React from 'react';
import UserListing from './UserListing';
import ErrorPopup from '../../components/ErrorPopup';
import SuccessPopup from '../../components/SuccessPopup';
import axios from 'axios';
import {url} from '../../components/Helper';
import {Box, TextField} from '@mui/material';
import Button from '@mui/material/Button';

/**
 * Search user page that has an input form for searching for a matching phrase in usernames,
 * and a list of UserListing results based on the phrase entered
 * @returns page for searching existing usernames
 */
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

  // Send a search request that returns a list of user information
  const searchUser = (e) => {
    if (e) e.preventDefault();
    // show user search results
    axios.get(`${url}/user/search`, {params: {
        token: localStorage.getItem('token'),
        search_phrase: searchValue
      }})
      .then(function(res) {
        setUsers(res.data.users);
      })
      .catch(function (error) {
        setErrorMsg(error.message);
        showError(true);
      });
  }


  return (
    <div>
      <SuccessPopup successMsg={successMsg} snackBarOpen={showSuccess} setSnackBarOpen={setShowSuccess} />
      <ErrorPopup successMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError} />
      <div style={{display: 'flex', flexDirection: 'row', margin: '30px', marginLeft: '5px'}}>
        <Box component='form' style={{marginLeft: '70px'}} onSubmit={(e) => searchUser(e)}>
          <TextField
            placeholder='Search Users'
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Box>
        <Button type='submit' onClick={(e) => searchUser(e)} variant='contained' sx={{marginLeft: '10px'}}>Search</Button>
      </div>
      <div>
        {users.length > 0 ? users.map((searchedUser, key) => {
          return (
            <UserListing key={key} searchUser={searchUser} searchedUser={searchedUser} setSuccessMsg={setSuccessMsg} setShowSuccess={setShowSuccess} setErrorMsg={setErrorMsg} setShowError={setShowError}/>
          )
        }) : <div style={{paddingTop: '50px', textAlign:'vertical'}}>There were no usernames that matched the phrase</div>}
      </div>
    </div>
  );
};
export default SearchUsers;