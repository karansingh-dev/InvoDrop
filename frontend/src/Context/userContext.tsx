import type { UserDetailsType } from "@/types/user";
import { getUserData } from "@/utils/api/user/getUserData";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface LayoutProps {
  children: React.ReactNode;
}

type UserContextType = {
  user: UserDetailsType | null;
  setToken: (token: string) => void;
  logOut: () => void;
  isLoading: boolean;
  setUser: (user: UserDetailsType | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = (props: LayoutProps) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState<boolean>(!!token); 
  
  const [user, setUser] = useState<UserDetailsType | null>(null);

  const setToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
    setIsLoading(true);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTokenState(null);
    setIsLoading(false);
    toast.success("Successfully Logged Out");
  };

  const {
    data: userData,
    status,
    error,
    isError,
    isSuccess,
    isPending,
  } = useQuery({
    queryFn: getUserData,
    queryKey: ["user"],
    enabled: !!token,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    if (isPending) {
      setIsLoading(true);
    } else if (isError) {
      console.error("Error fetching user:", error);
      setUser(null);
      setIsLoading(false);

      localStorage.removeItem("token");
      setTokenState(null);
    } else if (isSuccess) {
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);

        localStorage.removeItem("token");
        setTokenState(null);
      }
      setIsLoading(false);
    }
  }, [status, userData, token, isPending, isError, isSuccess, error]);

  const value: UserContextType = {
    user,
    isLoading,
    setToken,
    logOut,
    setUser,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
