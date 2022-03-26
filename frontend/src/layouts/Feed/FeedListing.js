import React, { useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import UsernameLink from '../../components/UsernameLink';
import SuccessPopup from '../../components/SuccessPopup';
import ErrorPopup from '../../components/SuccessPopup';

const FeedListing = ({ post, isPublic }) => {

  const createDate = (str) => {
    let li = str.split(' ');
    let time = li[1];
    const date = new Date(li[0].replace(/-/g,"/"));

    return date;
  }
  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ampm;
    return strTime;
  }
  return (
    <Card>
      <CardContent>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}} >
          <UsernameLink username={post.username} id={post.user_id} avatar={post.avatar} isPublic={isPublic} />
          <div>{formatAMPM(createDate(post.time_created))} {createDate(post.time_created).toLocaleDateString("en-AU")}</div>
        </div>
        {post.content}
      </CardContent>
    </Card>
  )
}

export default FeedListing;