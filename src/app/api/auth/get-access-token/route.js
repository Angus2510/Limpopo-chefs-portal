// src/app/api/auth/get-access-token/route.js
import { getAccessToken } from '@/utils/getAccessToken';

export async function GET(req) {
  try {
    console.log("Incoming request headers:", req.headers);  // Log request headers
    const token = getAccessToken(req);
    console.log("Access token:", token);  // Log the access token

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Error fetching access token:", error);  // Log any errors
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
