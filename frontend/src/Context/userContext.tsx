import type { UserDetailsType } from "@/types/user";
import { getUserData } from "@/utils/api/user/getUserData";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

export interface LayoutProps {
  children: React.ReactNode;
}

type UserContextType = {
  user: UserDetailsType | null;
  setIsLoggedIn: (isLogedIn: boolean) => void;
  setUser: (user: UserDetailsType | null) => void;
  isPending: boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = (props: LayoutProps) => {
  const token = sessionStorage.getItem("token");
  const [user, setUser] = useState<UserDetailsType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(token ? true : false);

  const { data: userData, isPending } = useQuery({
    queryFn: getUserData,
    queryKey: ["user"],
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
    } else setUser(null);
  }, [userData]);

  const value: UserContextType = { user, setIsLoggedIn, isPending, setUser };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
