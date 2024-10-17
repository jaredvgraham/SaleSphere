//auth context
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthFetch } from "./privateFetch";
import { IUser } from "@/models/userModel";
import { ReactNode } from "react";
import Loader from "@/components/loader";
import { User } from "@/types";
import { getMaxCompanies } from "@/contants";

type AuthContextType = {
  user: User | null;
  setUser: any;
  authLoading: boolean;
  setAuthLoading: any;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  authLoading: true,
  setAuthLoading: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const authFetch = useAuthFetch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("fetching user");

        const res = await authFetch("user", {
          method: "GET",
        });
        setUser({
          ...res.user,
          maxCompanies:
            getMaxCompanies[res.user.plan as keyof typeof getMaxCompanies] || 0,
        });

        setAuthLoading(false);

        if (res.user?.plan === "none") {
          router.push("/pricing");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    console.log("checking condition");
    if (user?.plan === "none" && pathname !== "/pricing") {
      router.push("/pricing");
    }
  }, [user, pathname]);

  if (authLoading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, authLoading, setAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuthTwo = () => useContext(AuthContext);
