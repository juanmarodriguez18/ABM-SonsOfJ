import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/loginEmpleado');
  };

  return (
    <Button
      variant="text"
      color="primary"
      onClick={handleLogin}
      sx={{
        px: 2,
        py: 1,
        fontSize: '0.875rem',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'gray',
        transition: 'color 0.1s ease-in-out',
        '&:hover': {
          color: 'indigo',
        },
        '&:focus-visible': {
          outline: 'none',
          ring: '2px solid indigo',
        },
        '&:active': {
          color: 'indigo',
        },
      }}
    >
      Log In
    </Button>
  );
};

export default LoginButton;
