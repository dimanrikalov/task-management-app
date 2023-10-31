import * as jwt from 'jsonwebtoken';
import { IJWTPayload } from 'src/interfaces/JWTPayload.interface';

export const extractJWTData = (token: string) => {
    return jwt.decode(token) as IJWTPayload;
};
