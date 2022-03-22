import UserListing from '../../SearchUsers/UserListing';
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const FollowerPopup = ({followers, setShowFollowers, setErrorMsg, setShowError}) => {

  const popupStyle = {
    position: "fixed",
    width: "800px",
    height: "575px",
    top: "50%",
    left: "50%",
    marginTop: "-300px",
    marginLeft: "-450px",
    backgroundColor: "white",
    outline: "1px solid grey",
    borderRadius: "15px",
    padding: "50px",
    zIndex: 5
  }

  const hideFollowers = () => {
    setShowFollowers(false)
  }
  return (
    <div>
      <div style={{position: "fixed", width: "100%", height: "100%", backgroundColor: "black", opacity: 0.3,  zIndex: 4, top: 0, left: 0}}></div>
      <div style={popupStyle}>
        <IconButton style={{position: "fixed", marginLeft: "790px", marginTop: "-30px"}} onClick={hideFollowers}>
          <CloseIcon/>
        </IconButton>
        <h1>Followers</h1>
        {followers.length > 0 ? followers.map((follower, id) => {
          return (
            <UserListing key={id} follower={follower} isFollowing={true} setErrorMsg={setErrorMsg} setShowError={setShowError}/>
          )
        }) : <div style={{paddingTop: "50px", textAlign:"vertical"}}>This account has no followers</div>}
      </div>
    </div>
  )
}

export default FollowerPopup;