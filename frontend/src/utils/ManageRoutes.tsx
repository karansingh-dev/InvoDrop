
import { Outlet, Navigate } from 'react-router-dom';

const ManageRoutes = () => {

    const token = sessionStorage.getItem("token");

    return token ? <Navigate to="/dashboard" /> : <Outlet /> // Redirect to dashboard if token is present

}

export default ManageRoutes;

