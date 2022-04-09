import React, { useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Pagination from '@mui/material/Pagination';

const Notifications = ({notificationHistory}) => {
  const [pageNotifs, setPageNotifs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(10);
  const pageSize = 10;

  const handleChangePage = (event, value) => {
    setPage(value);
    const start = (value-1)*pageSize;
    const end = value * pageSize;
    console.log(notificationHistory.length, value, start, end)
    setPageNotifs(notificationHistory.slice(start, end));
  }
  React.useEffect(() => {
    setPage(1);
    setPageCount(Math.ceil(notificationHistory.length / pageSize));
    setPageNotifs(notificationHistory.slice(0, pageSize));
  }, []);
  return (
    <div>
      <h1 style={{height: '40px'}}>Notifications</h1>
      {notificationHistory.length > 0 ? pageNotifs.map((notif) => {
        return (
          <Card>
            <CardContent>
              {notif.type} {notif.username} {notif.id} {notif.bookid}
            </CardContent>
          </Card>
        )
      }) : <div style={{paddingTop: "50px", textAlign:"vertical"}}>Follow other users to see their activity in your notifications</div>}
      {notificationHistory.length > 0 ? <Pagination sx={{margin: '20px'}} count={pageCount} page={page} onChange={handleChangePage} /> : <></>}
    </div>
  );
};
export default Notifications;