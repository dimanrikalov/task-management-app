import * as jwt from 'jsonwebtoken';

export const isValidJWTToken = (token: string) => {
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return true;
    } catch (err: any) {
        return false;
    }
};
