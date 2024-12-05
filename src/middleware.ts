import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, decodeJwt } from 'jose';
import axios from 'axios';
import cookie from 'cookie';
import { fetchRoles, Access } from '@/config/pagesAccess';
import type { User, UserRole, UserType, ActionType } from '@/types/types';

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

interface TokenPayload {
  UserInfo: User;
}

async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET) as { payload: TokenPayload };
    console.log('[Middleware] Verified token payload:', payload.UserInfo);
    return payload.UserInfo;
  } catch (error) {
    console.error('[Middleware] JWT verification failed:', error);
    return null;
  }
}

async function refreshAccessToken(req: NextRequest): Promise<{ accessToken: string, refreshToken: string } | null> {
  try {
    const cookies = req.headers.get('cookie');
    const { refreshToken } = cookie.parse(cookies || '');

    if (!refreshToken) {
      console.error('[Middleware] No refresh token found');
      return null;
    }

    const response = await axios.post('https://limpopochefs.vercel.app/api/auth/refresh', { ///rememver to change 
    // const response = await axios.post('http://localhost:3000/api/auth/refresh', { 
      refreshToken,
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'cookie': cookies
      },
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (!accessToken || !newRefreshToken) {
      console.error('[Middleware] Tokens are undefined in the response data');
      return null;
    }

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error('[Middleware] Token refresh failed:', error);
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeJwt(token);
  if (!decoded.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

async function checkAccess(
  path: string,
  userRoles: UserRole[],
  userId: string,
  action: ActionType,
  rolesData: { [key: string]: Access }
): Promise<boolean> {
  if (path.startsWith('/')) {
    path = path.slice(1);
  }

  // Allow all students to access student routes by default
  if (path.startsWith('student')) {
    return true;
  }

  // Allow all guardians to access guardian routes by default
  if (path.startsWith('guardian')) {
    return true;
  }

  const actionType = path.includes('edit') ? 'edit' : path.includes('add') ? 'upload' : action;
  let access = rolesData[path];
  if (!access) {
    const segments = path.split('/').filter(segment => segment && !segment.match(/^[0-9a-fA-F]{24}$/));
    while (segments.length > 0) {
      const basePath = segments.join('/');
      access = rolesData[basePath];
      if (access) {
        break;
      }
      segments.pop();
    }
    if (!access) {
      return false;
    }
  }

  const { actions } = access;
  return actions[actionType]?.some(roleOrId => userRoles.includes(roleOrId) || roleOrId === userId) ?? false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/auth/signin')) {
    return NextResponse.next();
  }

  const accessTokenCookie = req.cookies.get('accessToken');
  const accessToken = accessTokenCookie?.value;

  let user: User | null = null;

  if (!accessToken || isTokenExpired(accessToken)) {
    console.log('[Middleware] Access token missing or expired, attempting to refresh');
    const tokens = await refreshAccessToken(req);
    if (tokens) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = tokens;

      user = await verifyToken(newAccessToken);
      if (!user) {
        console.log('[Middleware] Failed to verify new access token, redirecting to login');
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }

      const accessTokenCookie = cookie.serialize('accessToken', newAccessToken, {
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

      const response = NextResponse.next();
      response.headers.set('Set-Cookie', accessTokenCookie);
      response.headers.append('Set-Cookie', refreshTokenCookie);

      return response;
    } else {
      console.log('[Middleware] Token refresh failed, redirecting to login');
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  } else {
    user = await verifyToken(accessToken);
    if (!user) {
      console.log('[Middleware] Failed to verify access token, redirecting to login');
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  }

  // Check if the user is inactive and redirect to auth/disabled if they are
  if (user && user.active === false) {
    console.log('[Middleware] User is inactive, redirecting to /auth/disabled', user);
    return NextResponse.redirect(new URL('/auth/disabled', req.url));
  }

  const fetchedRoles = await fetchRoles();
  if (!fetchedRoles) {
    console.log('[Middleware] Failed to fetch roles');
    return NextResponse.rewrite(new URL('/error', req.url));
  }

  const rolesData: { [key: string]: Access } = fetchedRoles;
  const isValidUserType = (userType: any): userType is UserType =>
    ['student', 'staff', 'defaultUserType','guardian'].includes(userType);

  const userType: UserType = isValidUserType(user.userType) ? user.userType : 'defaultUserType';
  const userId: string = user.id || 'defaultUserId';
  const userRoles: UserRole[] = user.roles;
  const action = (req.nextUrl.searchParams.get('action') || 'view') as ActionType;

  if (pathname.startsWith('/student') && userType !== 'student') {
    console.log('[Middleware] Non-student trying to access student route');
    return NextResponse.rewrite(new URL('/auth/denied', req.url));
  }

  if (pathname.startsWith('/admin') && userType === 'student') {
    console.log('[Middleware] Student trying to access admin route');
    return NextResponse.rewrite(new URL('/auth/denied', req.url));
  }

  if (pathname.startsWith('/guardian') && userType !== 'guardian') {
    console.log('[Middleware] Non-guardian trying to access guardian route');
    return NextResponse.rewrite(new URL('/auth/denied', req.url));
  }


  const hasAccess = await checkAccess(pathname, userRoles, userId, action, rolesData);
  if (!hasAccess) {
    console.log('[Middleware] User lacks required permissions');
    return NextResponse.rewrite(new URL('/auth/denied', req.url));
  }

  console.log('[Middleware] Access granted');
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/student/:path*', '/guardian/:path*'],
};
