import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Storage from './pages/Storage';
import AdminPanel from './pages/AdminPanel';

function App() {
  const { isAuthenticated, isAdmin } = useSelector(state => state.auth);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/storage" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/storage" />} />
        <Route path="/storage" element={isAuthenticated ? <Storage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;