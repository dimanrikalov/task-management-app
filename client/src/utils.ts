import { jwtDecode } from 'jwt-decode';

interface IJWTPayload {
	id: number;
	iat: number;
	exp: number;
	last_name: string;
	first_name: string;
}

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

export const clearRefreshToken = () => {
	document.cookie = `refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const setRefreshToken = (refreshToken: string) => {
	document.cookie = `refreshToken=${refreshToken}`
}

export const getRefreshToken = () => {
	return document.cookie.split('; ')[0].split('=')[1];
}