import { useAuth0 } from "@auth0/auth0-react";
import { Button, Typography } from "@mui/material";
import axios from "axios";

const ClientPage = () => {
  const { getAccessTokenSilently } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      console.log("token: " + token);

      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVER_URL}/api/client`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        Vista Cliente
      </Typography>
      <Typography variant="body1" className="px-6 mb-4 text-justify">
        Esta es la vista del cliente, puedes probar llamando a una API protegida.
      </Typography>
      <Button
        onClick={callApi}
        variant="contained"
        color="primary"
        className="font-bold"
      >
        Call Client API
      </Button>
    </div>
  );
};

export default ClientPage;
