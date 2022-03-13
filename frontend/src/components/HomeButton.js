import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

const HomeButton = () => {
  const navigate = useNavigate();
  const pressHome = () => {
    navigate('/');
  }

  const buttonStyle = {
    width: "40px",
    height: "40px",
    marginLeft: "-30px",
    marginTop: "-15px"
  }

  return (
    <IconButton aria-label="home" onClick={pressHome} style={buttonStyle}>
      <HomeIcon/>
    </IconButton>
  )
}

export default HomeButton;