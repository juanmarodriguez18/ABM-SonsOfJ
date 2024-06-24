import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

const ProfileButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate("/cliente/perfil")}
      sx={{
        px: 2,
        py: 1,
        fontSize: '0.875rem',
        fontWeight: 'bold',
        textAlign: 'center',
        transition: 'background-color 0.1s ease-in-out',
      }}
    >
      Perfil
    </Button>
  );
};

export default ProfileButton;
