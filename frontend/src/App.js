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
import {url, setUnreadNotifs} from "./components/Helper";
import { withSnackbar } from 'notistack';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import { number } from 'prop-types';

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
  const [numNotifs, setNumNotifs] = useState(0);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  let notifLen = 0;
  let lastNotif = {};

  useEffect(() => {
    if (localStorage.getItem('token')) {
      updateUserInfo(JSON.parse(localStorage.getItem('user')));
      updateLogin(true);

      // axios.get(`${url}/user/notifications`, {params: {
      //   token: localStorage.getItem('token')
      // }}).then(function(res){
      //   setNotificationHistory(res.data.notifications);
      //   lastNotif = res.data.notifications[0];
      // }).catch(function(error) {
      //   alert(JSON.stringify(error.response.data.message));
      // })

      // getUnseenNotifications();

      getAllNotifications();

      // Check for notification updates every 10 secs
      // let id;
      // const notifApi = async () => {
      //   await getAllNotifications();
      //   id = setTimeout(notifApi, 10000);
      // }
      // await notifApi();
      // return () => {
      //   clearTimeout(id);
      // };
    }
  }, []);

  const getUnreadNotifs = () => {
    axios.get(`${url}/user/getunreadnotif`, {params:{
      token: localStorage.getItem('token')
    }}).then(function(res) {
      console.log(res.data.unreadNotifs, 'unread notifs gotten')
      setNumNotifs(res.data.unreadNotifs);
    }).catch(function(error) {
      console.log('error in getunreadnotifs')
    });
  }

  const getUnseenNotifications = () => {

    const setSeen = (notifId) => {
      axios.post(`${url}/notification/setseen`, {
        token: localStorage.getItem('token'),
        notification_id: notifId
      }).then(function(response) {
        console.log('notif now seen');
      }).catch(function(error) {
        console.log('error setting notif seen');
      })
    }

    const setNewNotifNum = (isAdd, num) => {
      axios.post(`${url}/user/getunreadnotif`, {
        token: localStorage.getItem('token')
      }).then(function(res) {
        console.log(res.data.unreadNotifs, 'unread notifs gotten')
        if (isAdd) {
          setUnreadNotifs((res.data.unreadNotifs+num).toString());
        } else {
          setUnreadNotifs(num.toString());
        }
        setTimeout(() => {getUnreadNotifs();}, 2000);
      }).catch(function(error) {
        console.log('error in getunreadnotifs')
      });
    }

    const popupClick = (key, notifId) => {
      closeSnackbar(key);
      setSeen(notifId);
      setNewNotifNum(true, -1);
    }

    axios.get(`${url}/notification/getunread`, {params:{
      token: localStorage.getItem('token')
    }}).then(function(res) {
      console.log(res.data.notifications);
      setNewNotifNum(false, res.data.notifications.length);
      for (const currNotif of res.data.notifications) {
        if (currNotif.type === 'post') {
          const action = key => (
            <Button onClick={() => {navigate('/feed');popupClick(key, currNotif.notification_id)}} style={{color: 'white'}} >Your Feed</Button>
          );
          enqueueSnackbar(` ${currNotif.username} just posted to your feed`, {variant: 'info', autoHideDuration: 5000, action});
        } else if (currNotif.type === 'review') {
          const action = key => (
            <Button onClick={() => {navigate(`/book/?id=${currNotif.type_id}`);popupClick(key, currNotif.notification_id)}} style={{color: 'white'}} >Book Page</Button>
          )
          enqueueSnackbar(` ${currNotif.username} just reviewed a book`, {variant: 'success', autoHideDuration: 5000, action});
        } else if (currNotif.type === 'follow') {
          const action = key => (
            <Button onClick={() => {navigate(`/user/${currNotif.type_id}/profile`);popupClick(key, currNotif.notification_id);}} style={{color: 'white'}} >Their Profile</Button>
          )
          enqueueSnackbar(` ${currNotif.username} just followed your account`, {variant: 'warning', autoHideDuration: 5000, action});
        }
      }
    }).catch(function(error) {
      console.log('error getting unseen');
    });
  }

  const getAllNotifications = async () => {
    if (!localStorage.getItem('token')) return;
    // console.log('get notif');
    const response = await axios.get(`${url}/user/notifications`, {params: {
      token: localStorage.getItem('token')
    }})
    // return on fetch error
    if (response.status !== 200) return;
    const notifs = await response.data.notifications;
    const newNotif = notifs[0];

    const setNewNotifNum = (num) => {
      axios.get(`${url}/user/getunreadnotif`, {params:{
        token: localStorage.getItem('token')
      }}).then(function(res) {
        console.log(res.data.unreadNotifs, 'unread notifs gotten')
        setUnreadNotifs((res.data.unreadNotifs+num).toString());
        setTimeout(() => {getUnreadNotifs();}, 2000);
      }).catch(function(error) {
        console.log('error in getunreadnotifs')
      });
    }

    const popupClick = (key) => {
      closeSnackbar(key);
      setNewNotifNum(-1);
    }
    
    // update notifications history and unread notifications number if length has changed
    if (notifs.length !== notifLen && JSON.stringify(lastNotif) !== JSON.stringify(newNotif)) {
      let numNewNotifs = 0;
      if (notifs.length - notifLen > 5) {
        numNewNotifs = 5;
      } else {
        numNewNotifs = notifs.length - notifLen;
      }
      
      setNewNotifNum(numNewNotifs);
      for (let i = 0; i < numNewNotifs; i++) {
        let currNotif = notifs[i];
        if (currNotif.type === 'post') {
          const action = key => (
            <Button onClick={() => {navigate('/feed');popupClick(key)}} style={{color: 'white'}} >Your Feed</Button>
          );
          enqueueSnackbar(` ${currNotif.username} just posted to your feed`, {variant: 'info', autoHideDuration: 5000, action});
        } else if (currNotif.type === 'review') {
          const action = key => (
            <Button onClick={() => {navigate(`/book/?id=${currNotif.type_id}`);popupClick(key)}} style={{color: 'white'}} >Book Page</Button>
          )
          enqueueSnackbar(` ${currNotif.username} just reviewed a book`, {variant: 'success', autoHideDuration: 5000, action});
        } else if (currNotif.type === 'follow') {
          const action = key => (
            <Button onClick={() => {navigate(`/user/${currNotif.type_id}/profile`);popupClick(key);}} style={{color: 'white'}} >Their Profile</Button>
          )
          enqueueSnackbar(` ${currNotif.username} just followed your account`, {variant: 'warning', autoHideDuration: 5000, action});
        }
      }
      lastNotif = newNotif;
      notifLen = notifs.length;
      setNotificationHistory(notifs);
    }
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
              numNotifs={numNotifs}
              getUnreadNotifs={getUnreadNotifs}
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
          <Route path='notifications' element={<Notifications setNumNotifs={setNumNotifs} notificationHistory={notificationHistory} getUnreadNotifs={getUnreadNotifs} />} />
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