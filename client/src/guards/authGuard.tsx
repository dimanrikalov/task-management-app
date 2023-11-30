import { jwtDecode } from 'jwt-decode';
import { Navigate, Outlet } from 'react-router-dom';
import { extractTokens, isAccessTokenValid, refreshTokens } from '../utils';

export interface IJWTPayload {
	id: number;
	iat?: number;
	exp?: number;
	email: string;
	last_name: string;
	first_name: string;
}

export interface IOutletContext {
	accessToken: string;
	refreshToken: string;
	userData: IJWTPayload;
}

export const AuthGuard = () => {
	const { accessToken, refreshToken } = extractTokens();


	if (!accessToken) {
		return <Navigate to={'/auth/sign-in'} />
	}


	if (!isAccessTokenValid) {
		refreshTokens();
	}

	const userData = jwtDecode(extractTokens().accessToken) as IJWTPayload;


	const context: IOutletContext = {
		userData,
		accessToken,
		refreshToken,
	}
	return <Outlet context={context} />
};
