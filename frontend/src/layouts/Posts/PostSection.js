import React, { useState, useRef } from 'react';
import Card from "@material-ui/core/Card";
import {CardActionArea} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import Box from "@mui/material/Box";
import Rating from '@mui/material/Rating';
import CardContent from "@mui/material/CardContent";
import UsernameLink from "../../components/UsernameLink";


const PostSection = ({postInfo, userInfo}) => {


  return (
    <Card>
      <CardContent>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}} >
          <UsernameLink username={userInfo.username} id={userInfo.user_id} avatar={userInfo.avatar} />
          <div>{postInfo.time_created}</div>
        </div>
        <Box sx={{marginTop: '5px', marginLeft: '55px', overflowWrap: 'break-word'}}>
          {postInfo.content}
        </Box>
      </CardContent>
    </Card>
  )
};
export default PostSection;