import React, { useState, useRef } from 'react';
import '../App.css'
import { useNavigate } from 'react-router-dom';




const Login = ({ updateLogin }) => {
  const navigate = useNavigate();

  const loginSuccess = () => {
    updateLogin(true);
    navigate('/');
  }

    return (
      <div className='centre'>
        <button onClick={loginSuccess}>Login</button>
      </div>
    );
  };
export default Login;