import jwt from 'jsonwebtoken';
import 'dotenv/config';

// In a real app, you would have separate private/public keys
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-string';

export function signJwt(
  payload: object,
  keyName: 'accessTokenPrivateKey', // In a real app, you'd have more keys
  options?: jwt.SignOptions | undefined
) {
  return jwt.sign(payload, JWT_SECRET, {
    ...(options && options),
    algorithm: 'HS256', // Simple algorithm for this example
  });
}