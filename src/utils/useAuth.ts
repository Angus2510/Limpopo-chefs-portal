import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { parseCookies, destroyCookie } from 'nookies';

interface User {
  id: string;
  userType: string;
  userFirstName: string;
  userLastName: string;
  roles: string[];
  image: string | null;
  needsAgreement: boolean;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const cookies = parseCookies();
        const accessToken = cookies.accessToken;

        if (!accessToken) {
          router.push('/auth/signin');
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/auth/session', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error('Error verifying session:', error);
        destroyCookie(null, 'accessToken');
        destroyCookie(null, 'refreshToken');
        router.push('/auth/signin');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const signIn = async (identifier: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { identifier, password });
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const signOut = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      destroyCookie(null, 'accessToken');
      destroyCookie(null, 'refreshToken');
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, loading, signIn, signOut };
};

export default useAuth;
