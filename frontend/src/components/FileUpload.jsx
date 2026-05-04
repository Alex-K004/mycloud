import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadFile } from '../store/filesSlice';

const FileUpload = ({ userId = null, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert('Выберите файл');
    dispatch(uploadFile({ file, comment, userId })).then(() => {
      setFile(null);
      setComment('');
      onUploaded && onUploaded();
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={e => setFile(e.target.files[0])} required />
      <input type="text" placeholder="Комментарий" value={comment} onChange={e => setComment(e.target.value)} />
      <button type="submit">Загрузить</button>
    </form>
  );
};
export default FileUpload;