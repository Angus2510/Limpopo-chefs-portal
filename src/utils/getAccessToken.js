export function getAccessToken(req) {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) {
    console.log('No cookie header found');
    return null;
  }

  const cookies = Object.fromEntries(cookieHeader.split('; ').map(cookie => {
    const [name, ...rest] = cookie.split('=');
    return [name, rest.join('=')];
  }));
  
  console.log("Parsed cookies:", cookies);
  return cookies.accessToken || null;
}
