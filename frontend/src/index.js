import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider } from 'notistack';
import {BrowserRouter as Router} from 'react-router-dom';

ReactDOM.render(
  // <React.StrictMode>
  <SnackbarProvider
    maxSnack={4}
    iconVariant={{
      success: '📝',
      error: '✖️',
      warning: `👋🏻`,
      info: '✉️',}}
  >
    <Router>
      <App />
    </Router>
  </SnackbarProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
