import axios from 'axios';

export const refreshToken = async () => {
  try {
    const response = await axios.post('/api/auth/refresh', {}, {
      withCredentials: true,
    });

    const { accessToken } = response.data;
    if (!accessToken) {
      throw new Error('Failed to refresh access token');
    }

    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
