import {useEffect, useState} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Outlet,
  Route,
  useNavigate
} from 'react-router-dom';
import Main from './components/Main';
import Header from './components/Header';
import Login from './layouts/Login';
import Register from './layouts/Register';
import Home from './layouts/Home/Home';
import Quiz from './layouts/Quiz';
import EnterQuiz from './layouts/EnterQuiz';
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
  const [notificationHistory, setNotificationHistory] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(async () => {
    if (localStorage.getItem('token')) {
      updateUserInfo(JSON.parse(localStorage.getItem('user')));
      updateLogin(true);

      // Check for notification updates every 10 secs
      let id;
      const notifApi = async () => {
        await getNotifications();
        id = setTimeout(notifApi, 10000);
      }
      await notifApi();
      return () => {
        clearTimeout(id);
      };
    }
  }, []);

  const updateNotifHistory = (notifs) => {
    setNotificationHistory(notifs);
  }

  const getNotifications = async () => {
    if (!localStorage.getItem('token')) return;
    console.log('get notif')
    axios.get(`${url}/user/notifications`, {params: {
      token: localStorage.getItem('token')
    }}).then(function(res){
      const notifs = res.data.notifications;
      console.log(notifs)
      console.log(notificationHistory)
      
      if (notifs.length !== notificationHistory.length) {
        const newNotif = notifs[0];
        if (newNotif.type === 'post') {
          const action = key => (
            <Button onClick={() => {navigate('/feed')}} style={{color: 'white'}} >Your Feed</Button>
          );
          enqueueSnackbar(` ${newNotif.username} just posted to your feed`, {variant: 'info', autoHideDuration: 5000, action});
        } else if (newNotif.type === 'review') {
          const action = key => (
            <Button onClick={() => {navigate(`/book/?id=${newNotif.type_id}`)}} style={{color: 'white'}} >Book Page</Button>
          )
          enqueueSnackbar(` ${newNotif.username} just reviewed a book`, {variant: 'success', autoHideDuration: 5000, action});
        } else if (newNotif.type === 'follow') {
          const action = key => (
            <Button onClick={() => {navigate(`/user/${newNotif.type_id}/profile`)}} style={{color: 'white'}} >Their Profile</Button>
          )
          enqueueSnackbar(` ${newNotif.username} just followed your account`, {variant: 'warning', autoHideDuration: 5000, action});
        }
        updateNotifHistory(notifs);
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
          <Route path="enterquiz" element={<EnterQuiz />}>
            <Route path=":id" element={<EnterQuiz />} />
          </Route>
          <Route path='feed' element={<Feed />} />
          <Route path='publicfeed' element={<PublicFeed />} />
          <Route path='users' element={<SearchUsers  updateSearchResult={updateSearchResult} searchResult={searchResult} searchValue={searchValue}/>} />
          <Route path='searchbooks' element={<SearchBooks searchResult={searchResult} searchValue={searchValue} radioValue={radioValue} tempsearchRating={tempsearchRating} updateSearchResult={updateSearchResult} page={page} updatePage={updatePage} pageCount={pageCount} updatePageCount={updatePageCount} searchType={searchType} searchGenres={searchGenres} genreRating={genreRating}/>} />
          <Route path='notifications' element={<Notifications />} />
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
    </div>
  );
}

export default withSnackbar(App);