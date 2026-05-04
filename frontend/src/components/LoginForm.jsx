import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../store/authSlice';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate('/storage');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div><label>Логин</label><input value={username} onChange={e => setUsername(e.target.value)} required /></div>
      <div><label>Пароль</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
      <button type="submit">Войти</button>
    </form>
  );
};
export default LoginForm;