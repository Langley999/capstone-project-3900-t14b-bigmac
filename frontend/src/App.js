import {useEffect, useState} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Outlet,
  Route,
} from 'react-router-dom';
import Main from './components/Main';
import Header from './components/Header';
import Login from './layouts/Login';
import Register from './layouts/Register';
import Home from './layouts/Home/Home';
import Quiz from './layouts/Quiz';
import Feed from './layouts/Feed/Feed';
import PublicFeed from './layouts/Feed/PublicFeed';
import SearchUsers from './layouts/SearchUsers/SearchUsers';
import Notifications from './layouts/Notifications';
import Profile from './layouts/Profile/Profile';
import Collections from './layouts/Collections/Collections';
import Posts from './layouts/Posts';
import Analytics from './layouts/Analytics/Analytics';
import NavTabs from './components/NavTabs';
import {AvatarBanner} from './components/AvatarBanner';
import BookDetail from  './layouts/BookDetail'
import SearchBooks from "./layouts/SearchBooks/SearchBooks";
import axios from "axios";
import {url} from "./components/Helper";

function App() {
  const [ifLogin, setIfLogin] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [radioValue, setRadioValue] = useState('title');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      updateUserInfo(JSON.parse(localStorage.getItem('user')));
      updateLogin(true);
    }
  }, []);

  const updateLogin = (ifLogin) => {
    setIfLogin(ifLogin);
  }

  const updateUserInfo = (info) => {
    setUserInfo(info);
  }

  const updateRadioValue = (radioValue) => {
    setRadioValue(radioValue);
  }

  const updateSearchValue = (searchValue) => {
    setSearchValue(searchValue);
  }

  const updateSearchResult = (searchResult) => {
    setSearchResult(searchResult);
  }

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={
            <>
              <Header
                ifLogin={ifLogin}
                updateLogin={updateLogin}
                userInfo={userInfo}
                updateSearchValue={updateSearchValue}
                searchValue={searchValue}
                updateRadioValue={updateRadioValue}
                radioValue={radioValue}
                updateSearchResult={updateSearchResult}
              />
              <div className='centre'>
                <Outlet />
              </div>

            </>
          }>
            <Route path='/' element={<Home ifLogin={ifLogin} updateSearchResult={updateSearchResult}/>} />
            <Route path="book" element={<BookDetail userInfo={userInfo}/>}>
              <Route path=":id" element={<BookDetail userInfo={userInfo}/>} />
            </Route>
            <Route path='quiz' element={<Quiz />} />
            <Route path='feed' element={<Feed />} />
            <Route path='publicfeed' element={<PublicFeed />} />
            <Route path='users' element={<SearchUsers searchResult={searchResult} userInfo={userInfo}/>} />
            <Route path='searchbooks' element={<SearchBooks searchResult={searchResult}/>} />
            <Route path='notifications' element={<Notifications />} />
            <Route path='main' element={<Main />} />
            <Route path='user/:userid' element={
              <>
                <AvatarBanner userInfo={userInfo}/>
                <NavTabs/>
                <Outlet />
              </>
            }>
              <Route path='profile' element={<Profile userInfo={userInfo} updateUserInfo={updateUserInfo} />}/>
              <Route path='collections' element={<Collections userInfo={userInfo}/>}/>
              <Route path='posts' element={<Posts />}/>
              <Route path='analytics' element={<Analytics userInfo={userInfo}/>}/>
            </Route>
          </Route>

          <Route path="bookstation" element={
            <>
              <Outlet />
            </>
          }>
            <Route path="login" element={<Login updateLogin={updateLogin} updateUserInfo={updateUserInfo}/>} />
            <Route path="register" element={<Register updateLogin={updateLogin} updateUserInfo={updateUserInfo}/>} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;