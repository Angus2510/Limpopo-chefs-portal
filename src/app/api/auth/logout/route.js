import axios from 'axios';
import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST() {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/logout`);

    const accessTokenCookie = cookie.serialize('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: -1, // Expire the cookie immediately
      sameSite: 'strict',
      path: '/',
    });

    const refreshTokenCookie = cookie.serialize('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: -1, // Expire the cookie immediately
      sameSite: 'strict',
      path: '/',
    });

    const headers = new Headers();
    headers.append('Set-Cookie', accessTokenCookie);
    headers.append('Set-Cookie', refreshTokenCookie);

    return new NextResponse(JSON.stringify({ message: 'Logged out successfully' }), {
      status: 200,
      headers,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: error.response?.data?.message || 'Internal Server Error' }), {
      status: error.response?.status || 500,
    });
  }
}
