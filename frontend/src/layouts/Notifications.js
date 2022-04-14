import React, { useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Pagination from '@mui/material/Pagination';
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import {setUnreadNotifs} from '../components/Helper';

const Notifications = ({setNumNotifs, getUnreadNotifs, notificationHistory}) => {
  const [pageNotifs, setPageNotifs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(10);
  const pageSize = 10;

  React.useEffect(() => {
    // setAllSeen();
    // setNumNotifs(0);
    setZeroNotifs();
    setPage(1);
    setPageCount(Math.ceil(notificationHistory.length / pageSize));
    setPageNotifs(notificationHistory.slice(0, pageSize));
  }, [notificationHistory]);

  const setAllSeen = () => {
    axios.post(`${url}/notification/setallseen`, {
      token: localStorage.getItem('token')
    }).then(function(res) {
      console.log("set all seen");
    }).catch(function(error) {
      console.log("error setting all seen");
    })
  }

  const setZeroNotifs = () => {
    setUnreadNotifs("0");
    setTimeout(() => {getUnreadNotifs();}, 1500);
  }

  const handleChangePage = (event, value) => {
    setPage(value);
    const start = (value-1)*pageSize;
    const end = value * pageSize;
    console.log(notificationHistory.length, value, start, end)
    setPageNotifs(notificationHistory.slice(start, end));
  }
  
  return (
    <div>
      <h1 style={{height: '40px'}}>Notifications</h1>
      {notificationHistory.length > 0 ? pageNotifs.map((notif) => {
        const id = notif.type_id;
        return (
          <Card>
            <CardContent>
              {notif.type === 'follow' ? <Button component = {Link} to={`/user/${id}/profile`}>{notif.username} followed your account</Button> : <></>}
              {notif.type === 'review' ? <Button component = {Link} to={`/book/?id=${id}`}>{notif.username} reviewed a book</Button> : <></>}
              {notif.type === 'post' ? <Button component = {Link} to={`/feed`}>{notif.username} made a post</Button> : <></>}
            </CardContent>
          </Card>
        )
      }) : <div style={{paddingTop: "50px", textAlign:"vertical"}}>Follow other users to see their activity in your notifications</div>}
      {notificationHistory.length > 0 ? <Pagination sx={{margin: '20px'}} count={pageCount} page={page} onChange={handleChangePage} /> : <></>}
    </div>
  );
};
export default Notifications;