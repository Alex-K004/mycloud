import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const UserActions = ({ user, onDelete, onToggleAdmin, onManageFiles }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleDelete = () => {
    onDelete(user.id);
    setConfirmOpen(false);
  };
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button onClick={() => onToggleAdmin(user.id, user.is_admin)}>Сменить админа</button>
      <button onClick={() => setConfirmOpen(true)}>Удалить</button>
      <button onClick={onManageFiles}>Файлы</button>
      <ConfirmModal isOpen={confirmOpen} onConfirm={handleDelete} onCancel={() => setConfirmOpen(false)} message={`Удалить пользователя ${user.username}?`} />
    </div>
  );
};
export default UserActions;