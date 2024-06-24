import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import ProfileButton from "./ProfileButton";
import LoginButton from "./LoginButton";
import RegistroButton from "./RegistroButton";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Header = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        {/* logo - start */}
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
          El Buen Sabor
        </Typography>
        {/* logo - end */}
        {/* nav - start */}
        <Box sx={{ flexGrow: 1 }}>
          <Button component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', mx: 1 }}>
            Inicio
          </Button>
          <Button component={Link} to="/cliente" sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', mx: 1 }}>
            Cliente
          </Button>
          <Button component={Link} to="/admin" sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', mx: 1 }}>
            Admin
          </Button>
        </Box>
        {/* nav - end */}
        {/* buttons - start */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isAuthenticated ? (
            <>
              <LogoutButton />
              <ProfileButton />
            </>
          ) : (
            <>
              <LoginButton />
              <RegistroButton />
            </>
          )}
        </Box>
        {/* buttons - end */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
