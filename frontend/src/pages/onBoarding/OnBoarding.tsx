import LoadingScreen from "@/components/custom/Loaders/LoadingScreen";
import OnBoardingCarousel from "@/components/custom/OnBoarding/OnBoardingCarousel";
import { useUser } from "@/Context/userContext";
import { Navigate } from "react-router-dom";

export default function OnBoarding() {
  const { user, isLoading } = useUser();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (user.isCompanyAdded) return <Navigate to="/dashboard" />;

  return <OnBoardingCarousel />;
}
