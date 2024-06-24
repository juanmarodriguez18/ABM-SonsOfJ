import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      variant="text"
      color="primary"
      onClick={() =>
        loginWithRedirect({
          appState: {
            returnTo: window.location.pathname,
          },
        })
      }
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
