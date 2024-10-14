//auth context
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthFetch } from "./privateFetch";
import { IUser } from "@/models/userModel";
import { ReactNode } from "react";

type AuthContextType = {
  user: IUser | null;
  setUser: any;
  loading: boolean;
  setLoading: any;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authFetch("user", {
          method: "GET",
        });
        setUser(res.user);
        setLoading(false);
      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuthTwo = () => useContext(AuthContext);
