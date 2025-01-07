"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { parseCookies, destroyCookie } from "nookies";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionVerified = await verifySession();
        if (sessionVerified) {
          console.log("Session verified.");
        } else {
          console.warn("No active session found.");
        }
      } catch (error) {
        console.error("Error during session check:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (identifier, password) => {
    try {
      console.log("Attempting to log in...");
      const response = await axios.post("/api/auth/login", {
        identifier,
        password,
      });
      console.log("Login response:", response);

      const sessionVerified = await verifySession();
      if (sessionVerified) {
        console.log("Login successful, redirecting...");
        router.push("/auth/terms");
      } else {
        throw new Error("Session verification failed after login.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials or server error.");
    }
  };

  const verifySession = async () => {
    try {
      const { accessToken } = parseCookies();
      const response = await axios.get("/api/auth/session", {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      if (response.data && response.data.user) {
        console.log("Session verified, user data:", response.data.user);
        setUser(response.data.user); // Ensure userType is included here
        return true;
      }
      return false;
    } catch (error) {
      console.error("Session verification failed:", error);
      destroyCookie(null, "accessToken");
      destroyCookie(null, "refreshToken");
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      destroyCookie(null, "accessToken");
      destroyCookie(null, "refreshToken");
      setUser(null);
      console.log("Logout successful.");
      router.push("/auth/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
