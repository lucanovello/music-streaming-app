import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const updateApiToken = (token: string | null) => {
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  };

  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);

        if (token) {
          console.log("Token fetched successfully:", token);
        } else {
          console.log("No token found");
        }
      } catch (error: any) {
        updateApiToken(null);
        console.error("Error in auth provider:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [getToken]);

  if (loading) {
    return (
      <div className='h-screen w-full flex items-center justify-center'>
        <Loader className='size-12 text-emerald-500 animate-spin' />
      </div>
    );
  }

  return <div>{children}</div>;
};

export default AuthProvider;
