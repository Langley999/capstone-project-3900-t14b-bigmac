import {useEffect, useState} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Outlet,
  Route,
} from 'react-router-dom';
import Header from './components/Header';
import Login from './layouts/Login';
import Register from './layouts/Register';
import Home from './layouts/Home/Home';
import Quiz from './layouts/Quiz/Quiz';
import EnterQuiz from './layouts/Quiz/EnterQuiz';
import Feed from './layouts/Feed/Feed';
import PublicFeed from './layouts/Feed/PublicFeed';
import SearchUsers from './layouts/SearchUsers/SearchUsers';
import Notifications from './layouts/Notifications';
import Admin from './layouts/Quiz/Admin';
import Addquiz from './layouts/Quiz/Addquiz';
import Allquiz from './layouts/Quiz/Allquiz';
import Profile from './layouts/Profile/Profile';
import Collections from './layouts/Collections/Collections';
import Analytics from './layouts/Analytics/Analytics';
import NavTabs from './components/NavTabs';
import {AvatarBanner} from './components/AvatarBanner';
import BookDetail from  './layouts/BookDetails/BookDetail';
import EditQuiz from  './layouts/Quiz/EditQuiz';
import SearchBooks from './layouts/SearchBooks/SearchBooks';
import Posts from './layouts/Posts/Posts';
import { withSnackbar } from 'notistack';
import Recommendations from "./layouts/Recommendations";

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
  const [followingFav, setFollowingFav] = useState([]);
  const [newNotif, setNewNotif] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      updateUserInfo(JSON.parse(localStorage.getItem('user')));
      updateLogin(true);
    }
  }, []);

  const updateNewNotif = (newNotifs) => {
    setNewNotif(newNotifs);
  }

  const updateFollowingFav = (newFav) => {
    setFollowingFav(newFav);
  }

  const updateTempsearchRating = (newRating) => {
    setTempsearchRating(newRating);
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
                updateSearchGenres={updateSearchGenres}
                updateTempsearchRating={updateTempsearchRating}
                updateNewNotif={updateNewNotif}
              />
              <div className='centre'>
                <Outlet />
              </div>

            </>
          }>
            <Route path='/' element={
              <Home
                ifLogin={ifLogin}
                updateSearchResult={updateSearchResult}
                updateSearchType={updateSearchType}
                updateSearchGenres={updateSearchGenres}
                updatePage={updatePage}
                updatePageCount={updatePageCount}
                updateGenreRating={updateGenreRating}
                updateFollowingFav={updateFollowingFav}
                followingFav={followingFav}
              />}
            />
            <Route path='book' element={<BookDetail userInfo={userInfo} updateTabValue={updateTabValue}/>}>
              <Route path=':id' element={<BookDetail userInfo={userInfo} updateTabValue={updateTabValue}/>} />
            </Route>
            <Route path='quiz' element={<Quiz />} />
            <Route path='enterquiz' element={<EnterQuiz />}>
              <Route path=':id' element={<EnterQuiz />} />
            </Route>
            <Route path='feed' element={<Feed updateTabValue={updateTabValue}/>} />
            <Route path='publicfeed' element={<PublicFeed updateTabValue={updateTabValue}/>} />
            <Route path='users' element={<SearchUsers updateTabValue={updateTabValue}/>} />
            <Route path='searchbooks' element={
              <SearchBooks
                searchResult={searchResult}
                searchValue={searchValue}
                radioValue={radioValue}
                tempsearchRating={tempsearchRating}
                updateSearchResult={updateSearchResult}
                page={page}
                updatePage={updatePage}
                pageCount={pageCount}
                updatePageCount={updatePageCount}
                searchType={searchType}
                searchGenres={searchGenres}
                genreRating={genreRating}
                followingFav={followingFav}
              />}
            />
            <Route path='recommendations' element={<Recommendations searchType={searchType}/>}/>
            <Route path='notifications' element={<Notifications notifs={newNotif}/>} />
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

          <Route path='bookstation' element={
              <Outlet />
          }>
            <Route path='login' element={<Login updateLogin={updateLogin} updateUserInfo={updateUserInfo}/>} />
            <Route path='register' element={<Register updateLogin={updateLogin} updateUserInfo={updateUserInfo}/>} />
            <Route path='admin' element={<Admin />} />
            <Route path='makequiz' element={<Addquiz />} />
            <Route path='allquiz' element={<Allquiz />} />
            <Route path='editquiz' element={<EditQuiz userInfo={userInfo}/>}>
              <Route path=':id' element={<EditQuiz userInfo={userInfo}/>} />
            </Route>

          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default withSnackbar(App);