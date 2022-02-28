// import logo from './logo.svg';
import {useState} from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Link,
  Route,
} from 'react-router-dom';
import Main from './components/Main';
import Header from './components/Header';
import Login from './components/Login';

function App() {

  return (
    <div className="App">
      <Header/>
      <Router>
        <Link to="Main">Main</Link>
        <Link to="Login">Login</Link>

        <Routes>
          <Route path="/main" element={<Main />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
