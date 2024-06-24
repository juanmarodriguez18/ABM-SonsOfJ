import { useAuth0 } from "@auth0/auth0-react";
import { Typography } from "@mui/material";

const ClientProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="text-xl font-bold text-center">Cargando datos...</div>
    );
  }

  return isAuthenticated ? (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <img style={{ marginBottom: '8px' }} className="inline" src={user?.picture} alt={user?.name} />
      <Typography variant="h5" className="font-bold">{user?.nickname}</Typography>
      <Typography variant="body1">{user?.email}</Typography>
    </div>
  ) : (
    <Typography variant="h5" className="text-xl font-bold text-center">
      Presiona Log In para ver información de tu perfil.
    </Typography>
  );
};

export default ClientProfilePage;
