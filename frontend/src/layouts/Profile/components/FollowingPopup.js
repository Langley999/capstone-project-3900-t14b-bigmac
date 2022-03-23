import UsernameLink from '../../../components/UsernameLink';
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const FollowingPopup = ({followings, setShowFollowings}) => {

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

  const hideFollowings = () => {
    setShowFollowings(false)
  }

  const listingStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }
  return (
    <div>
      <div style={{position: "fixed", width: "100%", height: "100%", backgroundColor: "black", opacity: 0.3,  zIndex: 4, top: 0, left: 0}}></div>
      <div style={popupStyle}>
        <IconButton style={{position: "fixed", marginLeft: "790px", marginTop: "-30px"}} onClick={hideFollowings}>
          <CloseIcon/>
        </IconButton>
        <h1>Followings</h1>
        <div style={{overflowY: "scroll", width: "840px", height: "525px", borderTop: "1px solid lightgrey", borderBottom: "1px solid lightgrey"}}>
          {followings.length > 0 ? followings.map((user, idx) => {
            return (
              <Card key={idx} style={{width: "800px", margin: "auto"}}>
                <CardContent style={listingStyle}>
                  <UsernameLink username={user.username} id={user.user_id} avatar={user.avatar} />
                </CardContent>
              </Card>
            )
          }) : <div style={{paddingTop: "50px", textAlign:"vertical"}}>This account has no followings</div>}
        </div>
      </div>
    </div>
  )
}

export default FollowingPopup;