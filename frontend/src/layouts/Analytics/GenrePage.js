import React from 'react';

const GenrePage = ({ display }) => {
  if (display !== 'genres') return null;
  return (
    <div>
        <h2 style={{fontWeight: "normal"}}>Your Genres</h2>
    </div>
  )
}

export default GenrePage;