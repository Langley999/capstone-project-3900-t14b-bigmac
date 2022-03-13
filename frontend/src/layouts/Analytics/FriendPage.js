import React from 'react';

const FriendPage = ({ display }) => {
  if (display !== 'friends') return null;
  return (
    <div>
        <h2 style={{fontWeight: "normal"}}>Follow Activity</h2>
    </div>
  )
}

export default FriendPage;