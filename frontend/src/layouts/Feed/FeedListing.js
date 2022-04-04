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
  const formatAMPM = (str) => {
    let li = str.split(' ');
    let time = li[1].split(':');
    let hours = time[0];
    let minutes = time[1];
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let strTime = hours + ':' + minutes + ampm;
    return strTime;
  }

  let postSplit = [];
  let bookReview = [];
  if (post.content.match('^Added a review for')) {
    postSplit = post.content.split('<');
    bookReview = postSplit[1].split('>');
  }

  return (
    <Card>
      <CardContent>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}} >
          <UsernameLink username={post.username} id={post.user_id} avatar={post.avatar} isPublic={isPublic} />
          <div>{formatAMPM(post.time_created)} {createDate(post.time_created).toLocaleDateString("en-AU")}</div>
        </div>
        <br/>
        {post.content.match('^Added a review for') ?
          <>{postSplit[0]}<b>{bookReview[0]}</b><br/><br/>"<i>{bookReview[1].substring(2)} </i>"</>
        : <>{post.content}</>
        }
      </CardContent>
    </Card>
  )
}

export default FeedListing;