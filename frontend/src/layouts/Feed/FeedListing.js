import React, { useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar} from '@mui/material';

const FeedListing = ({ post }) => {
  return (
    <Card>
      <CardContent>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}} >
          <div style={{display: "flex", flexDirection: "row"}} >
            {post.avatar === undefined ?
            <Avatar fontSize="large"/> :
            <Avatar
              src={post.avatar}
              sx={{
                height: 45,
                mb: 0,
                width: 45
              }}
            />}
            {post.username}
          </div>
          {post.time_created}
        </div>
        {post.content}
      </CardContent>
    </Card>
  )
}

export default FeedListing;