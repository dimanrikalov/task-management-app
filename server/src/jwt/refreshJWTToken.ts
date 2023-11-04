import * as jwt from 'jsonwebtoken';
import { IJWTPayload } from './jwt.interfaces';

export const refreshJWTToken = (refreshToken: string) => {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const payload = decoded as IJWTPayload;
    // Modify the expiration time in the payload
    payload.exp =
        Math.floor(Date.now() / 1000) +
        Number(process.env.ACCESS_TOKEN_EXPIRES_IN);
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

    return { accessToken };
};
