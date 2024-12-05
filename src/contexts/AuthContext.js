"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { parseCookies, destroyCookie } from 'nookies';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenExpiryTime, setTokenExpiryTime] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      console.log('Checking session...');
      try {
        const sessionVerified = await verifySession();

        if (sessionVerified) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoggedIn) {
      checkSession();
    }
  }, [isLoggedIn]);

  const login = async (identifier, password) => {
    try {
      console.log('Attempting to log in...');
      const response = await axios.post('/api/auth/login', { identifier, password });
      console.log('Login response:', response);

      const sessionVerified = await verifySession();

      if (sessionVerified) {
        console.log('Login successful, session verified');
        setIsLoggedIn(true);
        router.push('/auth/terms');
      } else {
        console.error('Session verification failed.');
        throw new Error('Session verification failed.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const verifySession = async () => {
    console.log('Verifying session...');
    try {
      const { accessToken } = parseCookies();
      const response = await axios.get('/api/auth/session', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true,
      });
      setUser(response.data.user);
      console.log('Session verified, user set:', response.data.user);
      return true;
    } catch (error) {
      console.error('Session verification failed:', error);
      destroyCookie(null, 'accessToken');
      destroyCookie(null, 'refreshToken');
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    console.log('Logging out...');
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    destroyCookie(null, 'accessToken');
    destroyCookie(null, 'refreshToken');
    setUser(null);
    setIsLoggedIn(false);
    console.log('Logout successful, user set to null');
    router.push('/auth/signin');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
