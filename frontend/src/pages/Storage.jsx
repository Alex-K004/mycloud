import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFiles } from '../store/filesSlice';
import FileTable from '../components/FileTable';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Storage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.files);
  const { isAdmin } = useSelector(state => state.auth);
  const [targetUserId, setTargetUserId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    if (userId && isAdmin) setTargetUserId(userId);
    dispatch(fetchFiles(userId || null));
  }, [dispatch, isAdmin, targetUserId]);

  if (loading) return <LoadingSpinner />;
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Мои файлы</h2>
      {isAdmin && <input type="text" placeholder="ID пользователя" onChange={e => setTargetUserId(e.target.value)} />}
      <FileUpload userId={targetUserId} onUploaded={() => dispatch(fetchFiles(targetUserId))} />
      <FileTable files={items} onFileDeleted={() => dispatch(fetchFiles(targetUserId))} />
      <ErrorMessage />
    </div>
  );
};
export default Storage;