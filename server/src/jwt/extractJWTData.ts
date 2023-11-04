import * as jwt from 'jsonwebtoken';
import { IJWTPayload } from 'src/jwt/jwt.interfaces';

export const extractJWTData = (token: string) => {
    return jwt.decode(token) as IJWTPayload;
};
