import {useState} from 'react';
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
import Login from './layouts/Login';
import Register from './layouts/Register';
import Home from './layouts/Home/Home';
import Quiz from './layouts/Quiz';
import Feed from './layouts/Feed';
import SearchUsers from './layouts/SearchUsers';
import Notifications from './layouts/Notifications';
import Profile from './layouts/Profile/Profile';
import Collections from './layouts/Collections/Collections';
import Posts from './layouts/Posts';
import Analytics from './layouts/Analytics/Analytics';
import NavTabs from './components/NavTabs';
import Book from './components/Book';
import {AvatarBanner} from './components/AvatarBanner';

function App() {
  const [ifLogin, setIfLogin] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const updateLogin = (ifLogin) => {
    setIfLogin(ifLogin);
  }

  const updateUserInfo = (info) => {
    setUserInfo(info);
  }

  return (
    <div>
      <Router>
        <Routes>
        
          <Route path='/' element={
            <>
              <Header ifLogin={ifLogin} userInfo={userInfo}/>
              <div className='centre'>
                <Outlet />
              </div>

            </>
          }>
            <Route path='/' element={<Home ifLogin={ifLogin}/>} />
            <Route path="book" element={<Book />} />
            <Route path='quiz' element={<Quiz />} />
            <Route path='feed' element={<Feed />} />
            <Route path='users' element={<SearchUsers />} />
            <Route path='notifications' element={<Notifications />} />
            <Route path='main' element={<Main />} />
            
            <Route path='user' element={
              <>
                <AvatarBanner userInfo={userInfo}/>
                <NavTabs/>
                <Outlet />
              </>
            }>
              <Route path='profile' element={<Profile userInfo={userInfo} updateUserInfo={updateUserInfo}/>}/>
              <Route path='collections' element={<Collections />}/>
              <Route path='posts' element={<Posts />}/>
              <Route path='analytics' element={<Analytics />}/>
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
