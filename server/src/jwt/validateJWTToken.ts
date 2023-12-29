import * as jwt from 'jsonwebtoken';

export const validateJWTToken = (token: string) => {
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return true;
    } catch (err: any) {
        console.log(err.message);
        return false;
    }
};
