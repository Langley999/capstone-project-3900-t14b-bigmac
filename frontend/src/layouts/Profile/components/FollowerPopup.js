import UsernameLink from '../../../components/UsernameLink';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/**
 * Popup that appears when follower list button is clicked in user profile
 * @param {Object} followers list of objects containing follower information 
 * @returns a list of follower's avatar and username links
 */
const FollowerPopup = ({followers, setShowFollowers, getProfile}) => {

  const popupStyle = {
    position: 'fixed',
    width: '800px',
    height: '575px',
    top: '50%',
    left: '50%',
    marginTop: '-300px',
    marginLeft: '-450px',
    backgroundColor: 'white',
    outline: '1px solid grey',
    borderRadius: '15px',
    padding: '50px',
    zIndex: 5
  }

  // closes popup
  const hideFollowers = () => {
    setShowFollowers(false)
  }

  const listingStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
  return (
    <div>
      <div style={{position: 'fixed', width: '100%', height: '100%', backgroundColor: 'black', opacity: 0.3,  zIndex: 4, top: 0, left: 0}}></div>
      <div style={popupStyle}>
        <IconButton style={{position: 'fixed', marginLeft: '790px', marginTop: '-30px'}} onClick={hideFollowers}>
          <CloseIcon/>
        </IconButton>
        <h1>Followers</h1>
        <div style={{overflowY: 'scroll', width: '840px', height: '525px', borderTop: '1px solid lightgrey', borderBottom: '1px solid lightgrey'}}>
          {followers.length > 0 ? followers.map((follower, idx) => {
            return (
            <Card key={idx} style={{width: '800px', margin: 'auto'}}>
              <CardContent style={listingStyle}>
              <UsernameLink username={follower.username} id={follower.user_id} avatar={follower.avatar} getProfile={getProfile} hideFollowers={hideFollowers} />
              </CardContent>
            </Card>
            )
          }) : <div style={{paddingTop: '50px', textAlign:'vertical'}}>This account has no followers</div>}
        </div>
      </div>
    </div>
  )
}

export default FollowerPopup;