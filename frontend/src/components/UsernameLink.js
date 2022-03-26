import Button from '@mui/material/Button';
import {Link} from "react-router-dom";
import {Avatar} from '@mui/material';

const UsernameLink = ({username, id, avatar, getProfile, hideFollowers, hideFollowings, isPublic}) => {

  const userClick = () => {
    getProfile();
    if (hideFollowers !== null) hideFollowers();
    if (hideFollowings !== null) hideFollowings();
  }
  return (
    <div style={{display: "flex",flexDirection: "row"}}>
      {avatar === undefined ?
      <Avatar fontSize="large"/> :
      <Avatar
        src={avatar}
        sx={{
          height: 45,
          mb: 0,
          width: 45
        }}
      />}
      {isPublic ?
      <Button disabled="true" style={{textTransform: "none", fontSize:"16px"}}>{username}</Button>
      : <Button onClick={userClick} component = {Link} to={`/user/${id}/profile`} style={{textTransform: "none", fontSize:"16px"}}>{username}</Button>
      }
    </div>
  )
}

export default UsernameLink;