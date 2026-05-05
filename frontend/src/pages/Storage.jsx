import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchFiles } from '../store/filesSlice';
import FileTable from '../components/FileTable';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import api from '../api/axios';   // <-- добавлен импорт

const Storage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.files);
  const { isAdmin } = useSelector(state => state.auth);
  const [searchParams] = useSearchParams();
  const [targetUserId, setTargetUserId] = useState(null);
  const [targetUserName, setTargetUserName] = useState('');

  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId && isAdmin) {
      setTargetUserId(userId);
      api.get(`/users/${userId}/`).then(res => setTargetUserName(res.data.username));
    } else {
      setTargetUserId(null);
      setTargetUserName('');
    }
  }, [searchParams, isAdmin]);

  useEffect(() => {
    dispatch(fetchFiles(targetUserId));
  }, [dispatch, targetUserId]);

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <h2>{targetUserName ? `Файлы пользователя ${targetUserName}` : 'Мои файлы'}</h2>
      {isAdmin && !targetUserId && (
        <input type="text" placeholder="ID пользователя" onChange={e => setTargetUserId(e.target.value)} />
      )}
      <FileUpload userId={targetUserId} onUploaded={() => dispatch(fetchFiles(targetUserId))} />
      <FileTable files={items} onFileDeleted={() => dispatch(fetchFiles(targetUserId))} />
      <ErrorMessage />
    </div>
  );
};

export default Storage;