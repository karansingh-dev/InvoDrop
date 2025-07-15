import LoadingScreen from "@/components/custom/Loaders/LoadingScreen";
import { useUser } from "@/Context/userContext";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isCompanyAdded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
 

  return <Outlet />;
};

export default ProtectedRoutes;
