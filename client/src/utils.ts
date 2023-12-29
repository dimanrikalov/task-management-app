import { jwtDecode } from 'jwt-decode';
import { ITokens } from './guards/authGuard';

interface IJWTPayload {
	id: number;
	first_name: string;
	last_name: string;
	iat: number;
	exp: number;
}

export const extractTokens = (): ITokens => {
	const pattern = /(accessToken|refreshToken)=([^;]*)/g;
	let matches: RegExpExecArray | null;
	let tokens: { [key: string]: string } = {};
	while ((matches = pattern.exec(document.cookie)) !== null) {
		let tokenType: string = matches[1].trim();
		let tokenValue: string = matches[2].trim();
		tokens[tokenType] = tokenValue;
	}
	return {
		accessToken: tokens['accessToken'],
		refreshToken: tokens['refreshToken'],
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
	document.cookie.split(';').forEach(function (c) {
		document.cookie = c
			.replace(/^ +/, '')
			.replace(
				/=.*/,
				'=;expires=' + new Date().toUTCString() + ';path=/'
			);
	});
};

export const deleteAccessToken = () => {
	document.cookie = `accessToken=;expires=${new Date().toUTCString()};path=/`;
};
