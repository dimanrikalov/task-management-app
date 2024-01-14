import {
	generateImgUrl,
	setRefreshToken,
	getRefreshToken,
	clearRefreshToken,
	isAccessTokenValid,
} from '../utils';
import { jwtDecode } from 'jwt-decode';
import { useErrorContext } from './error.context';
import { METHODS, USER_ENDPOINTS, request } from '@/utils/requester';
import { createContext, useContext, useEffect, useState } from 'react';

export interface IUserData {
	id: number;
	email: string;
	username: string;
	profileImg: Buffer;
	profileImagePath: string;
}

interface IUserContext {
	logout(): void;
	accessToken: string;
	data: IUserData | null;
	isLoadingData: boolean;
	setAccessToken: React.Dispatch<React.SetStateAction<string>>
	setData: React.Dispatch<React.SetStateAction<IUserData | null>>
}

export interface IUserContextSecure {
	logout(): void;
	data: IUserData;
	accessToken: string;
	isLoadingData: boolean;
	setAccessToken: React.Dispatch<React.SetStateAction<string>>
	setData: React.Dispatch<React.SetStateAction<IUserData | null>>
}

const UserContext = createContext<IUserContext>({
	data: null,
	accessToken: '',
	logout: () => { },
	setData: () => { },
	isLoadingData: false,
	setAccessToken: () => { },
});

export const useUserContext = () => useContext<IUserContext>(UserContext);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const { showError } = useErrorContext();
	const [data, setData] = useState<IUserData | null>(null);
	const [accessToken, setAccessToken] = useState<string>('');
	const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
	const [refreshAfter, setRefreshAfter] = useState<number | null>(null);

	useEffect(() => {
		setIsLoadingData(true);

		const refreshToken = getRefreshToken();
		// If no refresh token or the time has passed, the user must be logged out
		if (!refreshToken || !isAccessTokenValid(refreshToken)) {
			setIsLoadingData(false);
			return;
		}

		// If user has a valid refresh token
		if (!accessToken || !isAccessTokenValid(accessToken)) {
			refreshTokens();
		}

		if (!data || !accessToken) return;

		setIsLoadingData(false);
	}, [accessToken, data]);

	useEffect(() => {
		if (!refreshAfter) return;

		const interval = setInterval(() => {
			refreshTokens();
		}, refreshAfter - 1000);
		//- 1000 adds a window for the request to complete before the old token expires
		return () => clearInterval(interval);
	}, [refreshAfter]);

	useEffect(() => {
		if (!accessToken) return;

		const setUser = async () => {
			try {
				const data = await request({
					accessToken,
					method: METHODS.GET,
					endpoint: USER_ENDPOINTS.USER,
				});

				const decoded = jwtDecode(accessToken);
				const expirationTime = decoded.exp! * 1000;
				const currentTime = Date.now();
				const timeRemaining = expirationTime - currentTime;

				setData({
					...data,
					profileImagePath: generateImgUrl(data.profileImg)
				});
				setRefreshAfter(timeRemaining);
			} catch (err: any) {
				console.log(err.message);
				showError(err.message);
				logout();
			}
		}

		setUser();

	}, [accessToken]);

	const refreshTokens = async () => {
		const refreshToken = getRefreshToken();

		if (!refreshToken || !isAccessTokenValid(refreshToken)) {
			logout();
			showError('Session expired! Please sign-in again!');
			return;
		}

		try {
			const data = await request({
				method: METHODS.POST,
				body: { refreshToken },
				endpoint: USER_ENDPOINTS.REFRESH,
			});

			setAccessToken(data.accessToken);
			setRefreshToken(data.refreshToken);
		} catch (err: any) {
			showError(err.message);
			logout();
		}
	};

	const logout = () => {
		clearRefreshToken();
		setData(null);
		setAccessToken('');
		setRefreshAfter(null);
	};

	const value = {
		data,
		logout,
		setData,
		accessToken,
		isLoadingData,
		setAccessToken,
	};
	return (
		<UserContext.Provider value={value}>{children}</UserContext.Provider>
	);
};
