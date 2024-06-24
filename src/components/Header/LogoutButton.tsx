import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      variant="text"
      color="primary"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
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
      Salir
    </Button>
  );
};

export default LogoutButton;
