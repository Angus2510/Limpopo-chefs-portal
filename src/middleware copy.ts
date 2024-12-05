// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { fetchRoles, Access } from '@/config/pagesAccess';
import type { User, UserRole, UserType, ActionType } from '@/types/types';

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

interface TokenPayload {
  UserInfo: User;
}

/**
 * Verify the JWT token from the access token cookie
 */
async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET) as { payload: TokenPayload };
    return payload.UserInfo;
  } catch (error) {
    console.error('[Middleware] JWT verification failed:', error);
    return null;
  }
}

/**
 * Check if the user has access to the requested path based on their roles
 */
async function checkAccess(
  path: string,
  userRoles: UserRole[],
  userId: string,
  action: ActionType,
  rolesData: { [key: string]: Access }
): Promise<boolean> {
  // Remove leading slash from path if present
  if (path.startsWith('/')) {
    path = path.slice(1);
  }

  // Determine the action type based on the path
  const actionType = path.includes('edit') ? 'edit' : path.includes('add') ? 'upload' : action;

  let access = rolesData[path];
  if (!access) {
    console.log(`[Middleware] Access data not found for path: ${path}`);
    // Remove segments from the end one by one to find a base path
    const segments = path.split('/').filter(segment => segment && !segment.match(/^[0-9a-fA-F]{24}$/));
    while (segments.length > 0) {
      const basePath = segments.join('/');
      access = rolesData[basePath];
      if (access) {
        console.log(`[Middleware] Access data found for base path: ${basePath}`);
        break;
      }
      segments.pop();
    }
    if (!access) {
      console.log(`[Middleware] Access data not found for any base path of: ${path}`);
      return false;
    }
  }

  const { actions } = access;

  // Check if any of the user's roles or userId have access to the action
  return actions[actionType]?.some(roleOrId => userRoles.includes(roleOrId) || roleOrId === userId) ?? false;
}

/**
 * Middleware function to handle authentication and authorization
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log(`[Middleware] Incoming request to ${pathname}`);

  // Allow public files and login route
  if (pathname.startsWith('/auth/signin')) {
    console.log('[Middleware] Public route or login route accessed');
    return NextResponse.next();
  }

  // Check for access token in cookies
  const accessTokenCookie = req.cookies.get('accessToken');
  const accessToken = accessTokenCookie?.value;

  console.log(`[Middleware] Access token: ${accessToken}`);

  if (!accessToken) {
    console.log('[Middleware] No access token found, redirecting to login');
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Verify the JWT token
  const user = await verifyToken(accessToken);
  if (!user) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  console.log(`[Middleware] JWT verified. User: ${JSON.stringify(user)}`);

  // Fetch roles and check access
  const fetchedRoles = await fetchRoles();
  if (!fetchedRoles) {
    console.error('[Middleware] Failed to fetch roles');
    return NextResponse.rewrite(new URL('/error', req.url));
  }

  const rolesData: { [key: string]: Access } = fetchedRoles;

  // Type guard to ensure userType is one of the expected values
  const isValidUserType = (userType: any): userType is UserType =>
    ['student', 'staff', 'defaultUserType'].includes(userType);

  const userType: UserType = isValidUserType(user.userType) ? user.userType : 'defaultUserType';
  const userId: string = user.id || 'defaultUserId';
  const userRoles: UserRole[] = user.roles;
  const action = (req.nextUrl.searchParams.get('action') || 'view') as ActionType;

  // Ensure only students can access /student routes
  if (pathname.startsWith('/student') && userType !== 'student') {
    console.log('[Middleware] Access denied: Non-student trying to access student route');
    return NextResponse.rewrite(new URL('/auth/denied', req.url));
  }

  // Ensure students cannot access /admin routes
  if (pathname.startsWith('/admin') && userType === 'student') {
    console.log('[Middleware] Access denied: Student trying to access admin route');
    return NextResponse.rewrite(new URL('/auth/denied', req.url));
  }

  // Check if user has the required access
  const hasAccess = await checkAccess(pathname, userRoles, userId, action, rolesData);
  if (!hasAccess) {
    console.log('[Middleware] Access denied: User lacks required permissions');
    return NextResponse.rewrite(new URL('/auth/denied', req.url));
  }

  console.log('[Middleware] Access granted');
  return NextResponse.next();
}

// Export the config for the matcher
export const config = {
  matcher: ['/admin/:path*', '/student/:path*'],
};
