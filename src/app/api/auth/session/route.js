// pages/api/auth/session.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(req) {
  const cookies = req.headers.get('cookie');
  const cookieString = cookies?.split('; ').find((row) => row.startsWith('accessToken='));

  if (!cookieString) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const accessToken = cookieString.split('=')[1];
  if (!accessToken) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(accessToken, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
    return new NextResponse(JSON.stringify({ user: payload.UserInfo }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }
}
