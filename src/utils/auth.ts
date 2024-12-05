// utils/auth.ts
import { jwtVerify } from 'jose';
import { User } from '@/types/types'

export async function fetchServerSession(headers: Record<string, string>): Promise<User | null> {
  try {
    const cookies = headers.cookie;
    const accessToken = cookies?.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

    if (!accessToken) {
      return null;
    }

    const { payload } = await jwtVerify(accessToken, new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
    return payload.UserInfo as User;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}
