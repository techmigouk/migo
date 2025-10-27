import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authOptions = {
  session: {
    strategy: 'jwt' as const,
  },
  secret: JWT_SECRET,
};

// JWT-based session check
export async function getServerSession(options?: typeof authOptions) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      user: {
        id: decoded.userId || decoded.id,
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.avatar,
      },
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Verify JWT token from Authorization header
export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId || decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      avatar: decoded.avatar,
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
