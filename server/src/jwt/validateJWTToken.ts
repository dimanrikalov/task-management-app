import * as jwt from 'jsonwebtoken';
import { extractJWTData } from './extractJWTData';
import { UnauthorizedException } from '@nestjs/common';

export const validateJWTToken = (token: string) => {
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const decodedToken = extractJWTData(token);

        if (!decodedToken) {
            throw new UnauthorizedException('Credentials missing!');
        }

        if (decodedToken.exp < (new Date().getTime() + 1) / 1000) {
            throw new UnauthorizedException('JWT Token has expired!');
        }

        return true;
    } catch (err: any) {
        console.log(err.message);
        return false;
    }
};
