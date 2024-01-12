import * as jwt from 'jsonwebtoken';
import { IRefreshTokenPayload } from './jwt.interfaces';
import { generateJWTTokens } from './generateJWTTokens';
import { IRefreshTokensBody } from 'src/users/dtos/users.interfaces';

export const refreshJWTTokens = ({
	payload,
	refreshToken
}: IRefreshTokensBody) => {
	const decoded = jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET
	) as IRefreshTokenPayload;

	if (decoded.id !== payload.userData.id) {
		throw new Error('User IDs do not match!');
	}

	const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
		generateJWTTokens(payload.userData);

	return { newAccessToken, newRefreshToken };
};
