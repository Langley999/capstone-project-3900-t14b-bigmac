import logo from './logo.svg';
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
import Book from './components/Book';
function App() {
  return (
    <div className="App">
      <Header className="App-header">

      </Header>
      <Router>
        <Link to="Main">Main</Link>
        <Link to="Login">Login</Link>
        <Link to="Book">Book</Link>
        <Routes>
          <Route path="/main" element={<Main />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/book" element={<Book />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
