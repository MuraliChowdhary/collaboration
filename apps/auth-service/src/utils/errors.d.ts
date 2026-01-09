import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { UserRole } from '../../../../packages/database/dist/src';
interface JwtPayload {
    user: {
        id: string;
        role: UserRole;
    };
}
export declare function signJwt(payload: object, options?: jwt.SignOptions): string;
export declare function verifyJwt(token: string): JwtPayload;
export {};
//# sourceMappingURL=errors.d.ts.map