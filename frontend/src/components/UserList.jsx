import { useNavigate } from 'react-router-dom';
import UserActions from './UserActions';

const UserList = ({ users, onUserDeleted, onAdminToggled }) => {
  const navigate = useNavigate();
  if (!users.length) return <p>Нет пользователей</p>;
  return (
    <table border="1" cellPadding="8" style={{ width: '100%' }}>
      <thead>
        <tr><th>Логин</th><th>Полное имя</th><th>Email</th><th>Админ</th><th>Файлов</th><th>Общий размер (МБ)</th><th>Действия</th></tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.username}</td><td>{user.full_name}</td><td>{user.email}</td>
            <td>{user.is_admin ? 'Да' : 'Нет'}</td><td>{user.file_count}</td>
            <td>{(user.total_size / (1024*1024)).toFixed(2)}</td>
            <td><UserActions user={user} onDelete={onUserDeleted} onToggleAdmin={onAdminToggled} onManageFiles={() => navigate(`/storage?userId=${user.id}`)} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default UserList;