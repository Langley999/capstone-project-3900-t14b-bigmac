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
import Admin from './layouts/Admin';
import Addquiz from './layouts/Addquiz';
import Allquiz from './layouts/Allquiz';
import Profile from './layouts/Profile/Profile';
import Collections from './layouts/Collections/Collections';
import Analytics from './layouts/Analytics/Analytics';
import NavTabs from './components/NavTabs';
import {AvatarBanner} from './components/AvatarBanner';
import BookDetail from  './layouts/BookDetail';
import EditQuiz from  './layouts/EditQuiz';
import SearchBooks from "./layouts/SearchBooks/SearchBooks";
import Posts from './layouts/Posts/Posts';
import axios from "axios";
import {url} from "./components/Helper";
import { withSnackbar } from 'notistack';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';

function App() {
  const [ifLogin, setIfLogin] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [radioValue, setRadioValue] = useState('title');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [searchRating, setSearchRating] = useState(0);
  const [searchType, setSearchType] = useState('');
  const [genreRating, setGenreRating] = useState(0);
  const [searchGenres, setSearchGenres] = useState('');
  const [tempsearchRating, setTempsearchRating] = useState(0);
  const [tempgenreRating, setTempgenreRating] = useState(0);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [notificationHistory, setNotificationHistory] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      updateUserInfo(JSON.parse(localStorage.getItem('user')));
      updateLogin(true);
    }
    // while (true) {
    //   setTimeout(() => {
    //     getNotifications();
    //   },3000);
    // }
  }, []);

  const followNotif = {
    variant: 'warning',
    autoHideDuration: 3000,
  }

  const postNotif = {
    variant: 'info',
    autoHideDuration: 3000,
  }

  const reviewNotif = {
    variant: 'success',
    autoHideDuration: 3000,
  }

  const getNotifications = () => {
    axios.get(`${url}//`, {params: {
      token: localStorage.getItem('token')
    }}).then(function(res){
      const notifs = res.data.notifications;
      if (notifs.length !== notificationHistory.length) {
        const lastNotif = notifs[notifs.length-1];
        if (lastNotif.type === 'post') {
          enqueueSnackbar(` ${lastNotif.username} just posted to your feed`, postNotif);
        } else if (lastNotif.type === 'review') {
          enqueueSnackbar(` ${lastNotif.username} just reviewed a book`, reviewNotif);
        } else if (lastNotif.type === 'follow') {
          enqueueSnackbar(` ${lastNotif.username} just followed your account`, followNotif);
        }
        setNotificationHistory(res.data.notifications);
      }
    }).catch(function(error) {
      alert(JSON.stringify(error.response.data.message));
    })
  }

  const updateTempsearchRating = (newRating) => {
    setTempsearchRating(newRating);
  }

  const updateTempgenreRating = (newRating) => {
    setTempgenreRating(newRating);
  }

  const updateSearchGenres = (newGenres) => {
    setSearchGenres(newGenres);
  }

  const updateGenreRating = (newRating) => {
    setGenreRating(newRating);
  }

  const updateSearchType = (type) => {
    setSearchType(type);
  }

  const updateSearchRating = (rating) => {
    setSearchRating(rating);
  }

  const updatePage = (newPage) => {
    setPage(newPage);
  }

  const updatePageCount = (newCount) => {
    setPageCount(newCount);
  }

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

  const updateTabValue = (newTabValue) => {
    setTabValue(newTabValue);
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
                updateTabValue={updateTabValue}
                searchRating={searchRating}
                updateSearchRating={updateSearchRating}
                updatePageCount={updatePageCount}
                updatePage={updatePage}
                updateSearchType={updateSearchType}
                updateGenreRating={updateGenreRating}
                genreRating={genreRating}
                searchGenres={searchGenres}
                updateSearchGenres={updateSearchGenres}
                updateTempsearchRating={updateTempsearchRating}
                // updateTempgenreRating={updateTempgenreRating}
              />
              <div className='centre'>
                <Outlet />
              </div>

            </>
          }>
            <Route path='/' element={<Home ifLogin={ifLogin} updateSearchResult={updateSearchResult} updateSearchType={updateSearchType} updateSearchGenres={updateSearchGenres} updatePage={updatePage} updatePageCount={updatePageCount} updateGenreRating={updateGenreRating}/>} />
            <Route path="book" element={<BookDetail userInfo={userInfo}/>}>
              <Route path=":id" element={<BookDetail userInfo={userInfo}/>} />
            </Route>
            <Route path='quiz' element={<Quiz />} />
            <Route path='feed' element={<Feed />} />
            <Route path='publicfeed' element={<PublicFeed />} />
            <Route path='users' element={<SearchUsers  updateSearchResult={updateSearchResult} searchResult={searchResult} searchValue={searchValue}/>} />
            <Route path='searchbooks' element={<SearchBooks searchResult={searchResult} searchValue={searchValue} radioValue={radioValue} tempsearchRating={tempsearchRating} updateSearchResult={updateSearchResult} page={page} updatePage={updatePage} pageCount={pageCount} updatePageCount={updatePageCount} searchType={searchType} searchGenres={searchGenres} genreRating={genreRating}/>} />
            <Route path='notifications' element={<Notifications notificationHistory={notificationHistory} />} />
            <Route path='main' element={<Main />} />
            <Route path='user/:userid' element={
              <>
                <AvatarBanner userInfo={userInfo}/>
                <NavTabs tabValue={tabValue} updateTabValue={updateTabValue}/>
                <Outlet />
              </>
            }>
              <Route path='profile' element={<Profile userInfo={userInfo} updateUserInfo={updateUserInfo}/>}/>
              <Route path='collections' element={<Collections userInfo={userInfo}/>}/>
              <Route path='posts' element={<Posts userInfo={userInfo}/>}/>
              <Route path='analytics' element={<Analytics userInfo={userInfo}/>}/>
            </Route>
          </Route>

          <Route path="bookstation" element={
              <Outlet />
          }>
            <Route path="login" element={<Login updateLogin={updateLogin} updateUserInfo={updateUserInfo}/>} />
            <Route path="register" element={<Register updateLogin={updateLogin} updateUserInfo={updateUserInfo}/>} />
            <Route path="admin" element={<Admin />} />
            <Route path="makequiz" element={<Addquiz />} />
            <Route path="allquiz" element={<Allquiz />} />
            <Route path="editquiz" element={<EditQuiz userInfo={userInfo}/>}>
              <Route path=":id" element={<EditQuiz userInfo={userInfo}/>} />
            </Route>

          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default withSnackbar(App);