import RegisterForm from '../components/RegisterForm';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
  return (
    <div>
      <h2>Регистрация</h2>
      <RegisterForm />
      <ErrorMessage />
    </div>
  );
};
export default Register;