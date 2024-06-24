import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={user?.picture} alt={user?.name} />
                <div style={{ marginLeft: '1rem' }}>
                    <Typography variant="h6">{user?.name}</Typography>
                    <Typography variant="body1">{user?.email}</Typography>
                    <Typography variant="body2">{user?.address}</Typography>
                    <Typography variant="body2">{user?.birthdate}</Typography>
                    <Typography variant="body2">{user?.phone_number}</Typography>
                </div>
            </div>
        )
    );
};

export default Profile;
