import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const authUtils = {
  // Generate JWT token
  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any
    });
  },

  // Verify JWT token
  verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  },

  // Generate password reset token
  generateResetToken(): string {
    return jwt.sign(
      { purpose: 'password-reset', timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  },

  // Verify reset token
  verifyResetToken(token: string): boolean {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return decoded.purpose === 'password-reset';
    } catch (error) {
      return false;
    }
  }
};