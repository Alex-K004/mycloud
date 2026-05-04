import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/users/').then(res => setUsers(res.data));
  }, []);

  const deleteUser = (id) => api.delete(`/users/${id}/`).then(() => setUsers(users.filter(u => u.id !== id)));
  const toggleAdmin = (id, current) => api.patch(`/users/${id}/toggle_admin/`).then(() => {
    setUsers(users.map(u => u.id === id ? { ...u, is_admin: !current } : u));
  });

  return (
    <div>
      <h2>Пользователи</h2>
      <table>
        <thead><tr><th>Логин</th><th>Email</th><th>Файлов</th><th>Общий размер</th><th>Админ</th><th>Действия</th></tr></thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.file_count}</td>
              <td>{(user.total_size / (1024*1024)).toFixed(2)} MB</td>
              <td>{user.is_admin ? 'Да' : 'Нет'}</td>
              <td>
                <button onClick={() => toggleAdmin(user.id, user.is_admin)}>Сменить админа</button>
                <button onClick={() => deleteUser(user.id)}>Удалить</button>
                <button onClick={() => navigate(`/storage?userId=${user.id}`)}>Управлять файлами</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminPanel;