import { jwtDecode } from 'jwt-decode';

interface IJWTPayload {
	id: number;
	first_name: string;
	last_name: string;
	iat: number;
	exp: number;
}

export const extractTokens = () => {
	const pattern =
		/accessToken=([^;]+)(?:; refreshToken=(?<refreshToken>[^;]+))?/;

	// Use regex exec method to find the match
	const match = pattern.exec(document.cookie);
	if (!match) {
		return { accessToken: '', refreshToken: '' };
		// throw new Error('No cookies found!');
	}
	const accessToken = match[1];
	const refreshToken = match[2];

	return { accessToken, refreshToken };
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

export const refreshTokens = async () => {
	const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/refresh`, {});
	const data = await res.json();
	if (data.errorMessage) {
		throw new Error(data.errorMessage);
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
