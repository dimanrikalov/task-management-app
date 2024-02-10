import * as jwt from 'jsonwebtoken';
import { IGenerateTokens, IJWTPayload } from './jwt.interfaces';

export const generateJWTTokens = (payload: IJWTPayload): IGenerateTokens => {
	const accessToken = jwt.sign(
		{ id: payload.id },
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN //in ms
		}
	);

	const refreshToken = jwt.sign(
		{ id: payload.id },
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN //in ms
		}
	);

	return { accessToken, refreshToken };
};
