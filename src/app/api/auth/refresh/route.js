// src/app/api/auth/refresh/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST(req) {
  const cookies = req.headers.get('cookie');
  const { refreshToken } = cookie.parse(cookies || '');

  if (!refreshToken) {
    console.error('[API] No refresh token provided');
    return new NextResponse(JSON.stringify({ message: 'Unauthorized - No refresh token provided' }), {
      status: 401,
    });
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/refresh`, { refreshToken });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    console.log('[API] Generated Access Token:', accessToken);
    console.log('[API] Generated Refresh Token:', newRefreshToken);

    const accessTokenCookie = cookie.serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 8,
      sameSite: 'strict',
      path: '/',
    });

    const refreshTokenCookie = cookie.serialize('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'strict',
      path: '/',
    });

    const headers = new Headers();
    headers.append('Set-Cookie', accessTokenCookie);
    headers.append('Set-Cookie', refreshTokenCookie);

    return new NextResponse(JSON.stringify({ message: 'Tokens refreshed successfully', accessToken, refreshToken: newRefreshToken }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[API] Token refresh failed:', error);
    return new NextResponse(JSON.stringify({ message: error.response?.data?.message || 'Internal Server Error' }), {
      status: error.response?.status || 500,
    });
  }
}
