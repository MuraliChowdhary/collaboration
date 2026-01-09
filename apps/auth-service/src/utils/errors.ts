import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { UserRole } from '../../../../packages/database/dist/src';

// In a real app, you would have separate private/public keys
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-string';

interface JwtPayload {
  user: {
    id: string,
    role: UserRole
  }
}

export function signJwt(
  payload: object,
  options?: jwt.SignOptions
) {
  return jwt.sign(payload, JWT_SECRET, {
    ...(options ?? {}),
    algorithm: 'HS256',
  });
}



export function verifyJwt(token: string) {

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload

  return decoded;
}