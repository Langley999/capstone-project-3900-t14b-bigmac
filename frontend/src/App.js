// import logo from './logo.svg';
import {useState} from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Outlet,
  Link,
  Route,
} from 'react-router-dom';
import Main from './components/Main';
import Header from './components/Header';
import Login from './components/Login';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Feed from './components/Feed';
import SearchUsers from './components/SearchUsers';
import Notifications from './components/Notifications';

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={
            <>
              <Header/>
              <Outlet />
            </>
          }>
            <Route path='/' element={<Home />} />
            <Route path='quiz' element={<Quiz />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/users' element={<SearchUsers />} />
            <Route path='/notifications' element={<Notifications />} />
            <Route path="main" element={<Main />} />
          </Route>

          <Route path="user" element={
            <>
              <Link to="main">Main</Link>
              <Link to="login">Login</Link>
              <Outlet />
            </>
          }>
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
