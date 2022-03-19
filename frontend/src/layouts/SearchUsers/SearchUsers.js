import React from 'react';
import UserListing from './UserListing';
import ErrorPopup from '../../components/ErrorPopup';
import SuccessPopup from '../../components/SuccessPopup';

const SearchUsers = ({searchResult}) => {
  const [successMsg, setSuccessMsg] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  return (
    <div>
      <SuccessPopup successMsg={successMsg} snackBarOpen={showSuccess} setSnackBarOpen={setShowSuccess} />
      <ErrorPopup successMsg={errorMsg} snackBarOpen={showError} setSnackBarOpen={setShowError} />
      {searchResult.length > 0 ? searchResult.map((searchedUser) => {
        return (
          <UserListing searchedUser={searchedUser} setSuccessMsg={setSuccessMsg} setShowSuccess={setShowSuccess} setErrorMsg={setErrorMsg} setShowError={setShowError}/>
        )
      }) : <div style={{paddingTop: "50px", textAlign:"vertical"}}>There were no usernames that matched the phrase</div>}
    </div>
  );
};
export default SearchUsers;