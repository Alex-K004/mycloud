import { useDispatch } from 'react-redux';
import { deleteFile, renameFile, updateComment } from '../store/filesSlice';

const FileActions = ({ file, onDelete, onRename, onCommentUpdate }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm('Удалить файл?')) {
      dispatch(deleteFile(file.id)).then(() => onDelete && onDelete(file.id));
    }
  };
  const handleRename = () => {
    const newName = prompt('Новое имя', file.original_name);
    if (newName) dispatch(renameFile({ fileId: file.id, newName })).then(() => onRename && onRename(file.id, newName));
  };
  const handleComment = () => {
    const newComment = prompt('Новый комментарий', file.comment);
    if (newComment !== null) dispatch(updateComment({ fileId: file.id, comment: newComment })).then(() => onCommentUpdate && onCommentUpdate(file.id, newComment));
  };
  const copyShareLink = () => {
    const url = `${process.env.REACT_APP_API_URL}/files/share/${file.share_link}/`;
    navigator.clipboard.writeText(url);
    alert('Ссылка скопирована');
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button onClick={handleDelete}>🗑️</button>
      <button onClick={handleRename}>✏️</button>
      <button onClick={() => window.open(`/api/files/${file.id}/download/`)}>⬇️</button>
      <button onClick={copyShareLink}>🔗</button>
      <button onClick={handleComment}>💬</button>
    </div>
  );
};
export default FileActions;