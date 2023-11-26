import { jwtDecode } from 'jwt-decode';

export const extractTokens = () => {
	const pattern =
		/accessToken=([^;]+)(?:; refreshToken=(?<refreshToken>[^;]+))?/;

	// Use regex exec method to find the match
	const match = pattern.exec(document.cookie);
	if (!match) {
		throw new Error('No cookies found!');
	}
	const accessToken = match[1];
	const refreshToken = match[2];

	return { accessToken, refreshToken };
};

export const isAccessTokenValid = (accessToken: string) => {
	const data = jwtDecode(accessToken);
	const isAccessTokenExpired = data.exp! < Date.now() / 1000;

	if (isAccessTokenExpired) {
		return false;
	}

	return true;
};

export const refreshTokens = async () => {
	await fetch(`${import.meta.env.VITE_SERVER_URL}/refresh`, {
		
	});
};
