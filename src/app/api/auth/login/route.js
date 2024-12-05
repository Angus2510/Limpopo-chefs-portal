import axios from 'axios';
import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST(req) {
  const { identifier, password } = await req.json();

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth`, {
      identifier,
      password,
    });

    const { accessToken, refreshToken, user } = response.data;

    const accessTokenCookie = cookie.serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      path: '/',
    });

    const refreshTokenCookie = cookie.serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      path: '/',
    });

    const headers = new Headers();
    headers.append('Set-Cookie', accessTokenCookie);
    headers.append('Set-Cookie', refreshTokenCookie);

    return new NextResponse(
      JSON.stringify({
        accessToken,
        refreshToken,
      }), {
      status: 200,
      headers,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: error.response?.data?.message || 'Internal Server Error' }), {
      status: error.response?.status || 500,
    });
  }
}
