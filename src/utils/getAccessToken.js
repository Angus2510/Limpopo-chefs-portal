export function getAccessToken(req) {
  const cookieHeader = req.headers.get("cookie");

  // Log the cookie header after it is defined
  console.log("Cookie header:", cookieHeader);

  if (!cookieHeader) {
    console.log("No cookie header found");
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, ...rest] = cookie.split("=");
      return [name, rest.join("=")];
    })
  );

  console.log("Parsed cookies:", cookies);
  return cookies.accessToken || null;
}
