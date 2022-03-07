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
import Login from './components/Login';
import Book from './components/Book';
function App() {
  const [ifLogin, setIfLogin] = useState(false);

  const updateLogin = (ifLogin) => {
    setIfLogin(ifLogin);
  }

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={
            <>
              <Header ifLogin={ifLogin}/>
              <Outlet />
            </>
          }>
            <Route path='/' element={<Home ifLogin={ifLogin}/>} />
            <Route path='quiz' element={<Quiz />} />
            <Route path='feed' element={<Feed />} />
            <Route path='users' element={<SearchUsers />} />
            <Route path='notifications' element={<Notifications />} />
            <Route path='main' element={<Main />} />
            <Route path='user' element={
              <>
                <NavTabs/>
                <AvatarBanner/>
                <Outlet />
              </>
            }>
              <Route path='profile' element={<Profile />}/>
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
            <Route path="login" element={<Login updateLogin={updateLogin}/>} />
            <Route path="register" element={<Register updateLogin={updateLogin}/>} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
