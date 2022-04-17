import React, { useState, useRef } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import UsernameLink from '../../components/UsernameLink';
import {createDate, formatAMPM} from '../../components/Helper';

/**
 * @returns a post listing to be shown in the following or public feed,
 * given the post and poster's information
 */
const FeedListing = ({ post, isPublic, username, avatar, id, removePost, isSelf }) => {

  // split posts containing reviews for further formatting
  let postSplit = [];
  let bookReview = [];
  if (post.content.match('^Added a review for')) {
    postSplit = post.content.split('<');
    bookReview = postSplit[1].split('>');
  }

  return (
    <Card>
      <CardContent>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} >
          <UsernameLink username={username ? username: post.username} id={id? id:post.user_id} avatar={avatar? avatar: post.avatar} isPublic={isPublic} />
          <div>{formatAMPM(post.time_created)} {createDate(post.time_created).toLocaleDateString('en-AU')}</div>
        </div>
        <br/>
        <div style={{marginTop: '5px', marginLeft: '55px', overflowWrap: 'break-word', display: 'flex', justifyContent: 'space-between'}}>
          <div>
          {post.content.match('^Added a review for') ?
            <>{postSplit[0]}<b>{bookReview[0]}</b><br/><br/>"<i>{bookReview[1].substring(2)} </i>"</>
          : <>{post.content}</>
          }</div>
          {isSelf ? <Button onClick={removePost}>Remove</Button> : null}
        </div>
      </CardContent>
    </Card>
  )
}

export default FeedListing;