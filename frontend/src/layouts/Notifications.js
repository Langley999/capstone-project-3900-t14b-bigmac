import React, { useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Pagination from '@mui/material/Pagination';
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import axios from "axios";
import {url} from "../components/Helper";

const Notifications = ({notifs}) => {
  const [notifications, setNotifications] = useState([]);
  const [pageNotifs, setPageNotifs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(10);
  const pageSize = 10;

  const handleChangePage = (event, value) => {
    setPage(value);
    const start = (value-1)*pageSize;
    const end = value * pageSize;
    setPageNotifs(notifications.slice(start, end));
  }
  React.useEffect(() => {
    console.log('rendering here')
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
  return (
    <div>
      <h1 style={{height: '40px'}}>Notifications</h1>
      {notifications.length > 0 ? pageNotifs.map((notif) => {
        return (
          <Card>
            <CardContent>
              {notif.type === 'follow' ? <Button component = {Link} to={`/user/${notif.sender_id}/profile`}>{notif.sender_name} followed your account</Button> : <></>}
              {notif.type === 'review' ? <Button component = {Link} to={`/book/?id=${notif.book_id}`}>{notif.sender_name} reviewed "{notif.book_name}"</Button> : <></>}
              {notif.type === 'post' ? <Button component = {Link} to={`/feed`}>{notif.sender_name} made a post</Button> : <></>}
            </CardContent>
          </Card>
        )
      }) : <div style={{paddingTop: "50px", textAlign:"vertical"}}>Follow other users to see their activity in your notifications</div>}
      {notifications.length > 0 ? <Pagination sx={{margin: '20px'}} count={pageCount} page={page} onChange={handleChangePage} /> : null}
    </div>
  );
};
export default Notifications;