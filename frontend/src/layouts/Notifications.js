import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Pagination from '@mui/material/Pagination';
import {Link} from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import {url, createDate, formatAMPM} from '../components/Helper';
import CardActionArea from '@mui/material/CardActionArea';

/**
 * Fetches the logged in user's notifications and displays it with pagination in the notification page
 * @param {int} notifs number of new notifications
 * @returns title and list of clickable cards that link to the corresponding notification
 */
const Notifications = ({notifs}) => {
  const [notifications, setNotifications] = useState([]);
  const [pageNotifs, setPageNotifs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(10);
  const pageSize = 10;

  // fetch user's notifications on page load and every time the number of new nofications change
  React.useEffect(() => {
    axios.get(`${url}/notification/getall`, {
      params: {
        token: localStorage.getItem('token')
      }
    }).then(res => {
      setNotifications(res.data.notifications);
      setPage(1);
      setPageCount(Math.ceil(res.data.notifications.length / pageSize));
      setPageNotifs(res.data.notifications.slice(0, pageSize));
    })
  }, [notifs]);

  // handles pagination onChange
  const handleChangePage = (event, value) => {
    setPage(value);
    const start = (value-1)*pageSize;
    const end = value * pageSize;
    setPageNotifs(notifications.slice(start, end));
  }
  
  const userLinkStyle = {
    minWidth: 0,
    minHeight: 0,
    fontSize: '18px',
    paddingTop: '1px',
    marginLeft: '4px',
    textTransform: 'none'
  }

  const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }

  const UsernameButton = ({notif}) => {
    return (
      <Button style={userLinkStyle} component = {Link} to={`/user/${notif.sender_id}/profile`}>{notif.sender_name}</Button>
    )
  }
  const FormattedTime = ({notif}) => {
    return (
      <div style={{marginTop: '25px', marginRight: '15px'}} >{formatAMPM(notif.time)} {createDate(notif.time).toLocaleDateString('en-AU')}</div>
    )
  }
  return (
    <div>
      <h1 style={{height: '40px'}}>Notifications</h1>
      {notifications.length > 0 ? pageNotifs.map((notif, idx) => {
        return (
          <Card key={idx}>
            {notif.type === 'follow' ? 
            <CardActionArea component = {Link} to={`/user/${notif.sender_id}/profile`}>
              <div style={rowStyle}>
                <CardContent>
                  👋🏻 <UsernameButton notif={notif}/> followed your account <br/><i style={{marginLeft: '30px'}}>Click to see their profile</i>
                  </CardContent>
                <FormattedTime notif={notif}/>
              </div>
            </CardActionArea> : <></>}

            {notif.type === 'review' ?
            <CardActionArea component = {Link} to={`/book/?id=${notif.book_id}`}>
              <div style={rowStyle}>
                <CardContent>
                  📝 <UsernameButton notif={notif}/> reviewed <b>{notif.book_name}</b> <br/><i style={{marginLeft: '30px'}}>Click to see the book page</i>
                </CardContent>
                <FormattedTime notif={notif}/>
              </div>
            </CardActionArea> : <></>}

            {notif.type === 'post' ?
            <CardActionArea component = {Link} to={`/feed`}>
              <div style={rowStyle}>
                <CardContent>
                  ✉️ <UsernameButton notif={notif}/> made a post <br/><i style={{marginLeft: '30px'}}>Click to see your feed</i>
                </CardContent>
                <FormattedTime notif={notif}/>
              </div>
            </CardActionArea> : <></>}
          </Card>
        )
      }) : <div style={{paddingTop: '50px', textAlign:'vertical'}}>Follow other users to see their activity in your notifications</div>}
      {notifications.length > 0 ? <Pagination sx={{margin: '20px'}} count={pageCount} page={page} onChange={handleChangePage} /> : null}
    </div>
  );
};
export default Notifications;