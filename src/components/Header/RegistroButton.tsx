import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';

const RegistroButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() =>
        loginWithRedirect({
          appState: {
            returnTo: "/cliente/perfil",
          },
          authorizationParams: {
            screen_hint: "signup",
          },
        })
      }
      sx={{
        px: 2,
        py: 1,
        fontSize: '0.875rem',
        fontWeight: 'bold',
        textAlign: 'center',
        transition: 'background-color 0.1s ease-in-out',
      }}
    >
      Sign up
    </Button>
  );
};

export default RegistroButton;
