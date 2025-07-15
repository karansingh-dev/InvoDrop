
import { useUser } from "@/Context/userContext";
import { Outlet, Navigate } from "react-router-dom";


const ManageRoutes = () => {
  const { user} = useUser();
 
 
 
  return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default ManageRoutes;