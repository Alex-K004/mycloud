import FileActions from './FileActions';

const FileTable = ({ files, onFileDeleted, onFileRenamed, onCommentUpdated }) => {
  if (!files.length) return <p>Файлов нет</p>;
  return (
    <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Имя</th><th>Размер (КБ)</th><th>Комментарий</th><th>Дата загрузки</th><th>Последнее скачивание</th><th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {files.map(file => (
          <tr key={file.id}>
            <td>{file.original_name}</td>
            <td>{(file.size / 1024).toFixed(2)}</td>
            <td>{file.comment}</td>
            <td>{new Date(file.uploaded_at).toLocaleString()}</td>
            <td>{file.last_downloaded_at ? new Date(file.last_downloaded_at).toLocaleString() : '—'}</td>
            <td><FileActions file={file} onDelete={onFileDeleted} onRename={onFileRenamed} onCommentUpdate={onCommentUpdated} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default FileTable;