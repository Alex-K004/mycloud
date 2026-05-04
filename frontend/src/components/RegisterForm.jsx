import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../store/authSlice';

const RegisterForm = () => {
  const [form, setForm] = useState({ login: '', full_name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const err = {};
    if (!/^[A-Za-z][A-Za-z0-9]{3,19}$/.test(form.login)) err.login = 'Логин: 4-20 символов, латиница, первый символ буква';
    if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(form.email)) err.email = 'Неверный email';
    if (!/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}/.test(form.password)) err.password = 'Пароль: мин. 6 символов, заглавная буква, цифра, спецсимвол';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await dispatch(registerUser({ username: form.login, full_name: form.full_name, email: form.email, password: form.password }));
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div><label>Логин</label><input value={form.login} onChange={e => setForm({...form, login: e.target.value})} />{errors.login && <span style={{color:'red'}}>{errors.login}</span>}</div>
      <div><label>Полное имя</label><input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required /></div>
      <div><label>Email</label><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />{errors.email && <span style={{color:'red'}}>{errors.email}</span>}</div>
      <div><label>Пароль</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />{errors.password && <span style={{color:'red'}}>{errors.password}</span>}</div>
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};
export default RegisterForm;