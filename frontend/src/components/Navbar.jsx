import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';

const Navbar = () => {
  const { isAuthenticated, isAdmin } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav>
      <Link to="/">Главная</Link>
      {isAuthenticated ? (
        <>
          {isAdmin && <Link to="/admin">Панель администратора</Link>}
          <Link to="/storage">Мои файлы</Link>
          <button onClick={handleLogout}>Выход</button>
        </>
      ) : (
        <>
          <Link to="/login">Вход</Link>
          <Link to="/register">Регистрация</Link>
        </>
      )}
    </nav>
  );
};
export default Navbar;