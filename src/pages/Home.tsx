import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Button, Typography } from "@mui/material";

const Home = () => {
  const { user, isAuthenticated } = useAuth0();

  const callApi = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVER_URL}/api/public`
      );

      console.log(response);

      const responseData = response.data;

      alert(responseData.message);
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto', maxWidth: '800px' }}>
      <Typography variant="h4" className="mb-4 font-bold">
        Home
      </Typography>
      <Typography variant="body1" className="px-6 mb-4 text-justify">
        Bienvenidos a El Buen Sabor
      </Typography>
      {isAuthenticated ? (
        <Typography variant="body1" className="font-semibold text-green-500">
          Iniciado sesión como {user?.name}
        </Typography>
      ) : (
        <Typography variant="body1" className="font-semibold text-red-500">
          No has iniciado sesión.
        </Typography>
      )}
      <div className="mt-4">
        <Button
          onClick={callApi}
          variant="contained"
          color="primary"
          className="font-bold"
        >
          Public API
        </Button>
      </div>
    </div>
  );
};

export default Home;
