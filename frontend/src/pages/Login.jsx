import LoginForm from '../components/LoginForm';
import ErrorMessage from '../components/ErrorMessage';

const Login = () => {
  return (
    <div>
      <h2>Вход</h2>
      <LoginForm />
      <ErrorMessage />
    </div>
  );
};
export default Login;