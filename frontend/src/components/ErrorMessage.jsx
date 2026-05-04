import { useDispatch, useSelector } from 'react-redux';
import { resetError } from '../store/authSlice';

const ErrorMessage = () => {
  const error = useSelector(state => state.auth.error);
  const dispatch = useDispatch();
  if (!error) return null;
  return (
    <div style={{ color: 'red', border: '1px solid red', padding: '0.5rem', margin: '1rem' }}>
      {typeof error === 'string' ? error : JSON.stringify(error)}
      <button onClick={() => dispatch(resetError())}>Закрыть</button>
    </div>
  );
};
export default ErrorMessage;