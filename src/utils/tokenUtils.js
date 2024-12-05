import jwtDecode from 'jwt-decode';

export const isTokenExpired = (token) => {
  if (!token) return true;

  const decodedToken = jwtDecode(token);
  const now = Math.floor(Date.now() / 1000);
  return decodedToken.exp < now;
};
