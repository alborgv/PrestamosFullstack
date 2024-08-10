import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';


function LogoutButton() {
    const { logoutUser } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            logoutUser();
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;