import * as jwt from 'jsonwebtoken';
import { IRefreshTokenPayload } from './jwt.interfaces';
import { IRefreshTokensBody } from 'src/users/dtos/users.interfaces';

export const refreshJWTTokens = ({
    payload,
    refreshToken,
}: IRefreshTokensBody) => {
    const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
    ) as IRefreshTokenPayload;

    console.log(decoded.userId);
    console.log(payload.userData.id);

    if (decoded.userId !== payload.userData.id) {
        throw new Error('User IDs do not match!');
    }

    const newAccessToken = jwt.sign(
        payload.userData,
        process.env.ACCESS_TOKEN_SECRET,
        {
            // expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        },
    );

    const newRefreshToken = jwt.sign(
        { userId: decoded.userId },
        process.env.REFRESH_TOKEN_SECRET,
        {
            // expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
        },
    );

    return { newAccessToken, newRefreshToken };
};
