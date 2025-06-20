
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {

    const token = sessionStorage.getItem("token");

    return token ? <Outlet /> : <Navigate to="/login" /> // Redirect to login if not authenticated

}

export default ProtectedRoutes;

