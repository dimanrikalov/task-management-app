import { jwtDecode } from 'jwt-decode';
import { ITokens } from './guards/authGuard';

interface IJWTPayload {
	id: number;
	iat: number;
	exp: number;
	last_name: string;
	first_name: string;
}

export const setTokens = ({ accessToken, refreshToken }: ITokens) => {
	localStorage.setItem('accessToken', accessToken);
	localStorage.setItem('refreshToken', refreshToken);
};

export const getTokens = (): ITokens => {
	const accessToken = localStorage.getItem('accessToken')!;
	const refreshToken = localStorage.getItem('refreshToken')!;

	return {
		accessToken,
		refreshToken
	};
};

export const isAccessTokenValid = (accessToken: string) => {
	try {
		const data = jwtDecode(accessToken);

		if (!data) {
			return false;
		}
		const isAccessTokenExpired =
			(data as IJWTPayload).exp < Date.now() / 1000;

		if (isAccessTokenExpired) {
			return false;
		}

		return true;
	} catch (err: any) {
		return false;
	}
};

export const deleteTokens = () => {
	localStorage.clear();
};
