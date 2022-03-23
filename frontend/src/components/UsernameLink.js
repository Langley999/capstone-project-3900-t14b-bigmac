import Button from '@mui/material/Button';
import {Link} from "react-router-dom";
import {Avatar} from '@mui/material';

const UsernameLink = ({username, id, avatar}) => {
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
      <Button component = {Link} to={`/user/${id}/profile`} style={{textTransform: "none", fontSize:"16px"}}>{username}</Button>
    </div>
  )
}

export default UsernameLink;