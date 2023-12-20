import { ROUTES } from '@/router';
import { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { METHODS, USER_ENDPOINTS, request } from '@/utils/requester';
import { deleteTokens, extractTokens, isAccessTokenValid } from '../utils';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';

export interface ITokens {
	accessToken: string;
	refreshToken: string;
}
export interface IUserData {
	id: number;
	email: string;
	lastName: string;
	firstName: string;
	profileImg: Buffer;
	profileImagePath: string;
}

export interface IOutletContext {
	accessToken: string;
	userData: IUserData;
}


export const AuthGuard = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [tokens, setTokens] = useState<ITokens>(extractTokens());
	const [userData, setUserData] = useState<IUserData | null>(null);

	useEffect(() => {
		const refreshTokens = async () => {
			const data = await request({
				method: METHODS.GET,
				endpoint: USER_ENDPOINTS.REFRESH
			})

			if (data.errorMessage) {
				console.log(data.errorMessage);
				throw new Error('Invalid refresh token!');
			}
			setTokens(extractTokens());
		}

		const getUserData = async () => {
			const data = await request({
				method: METHODS.GET,
				endpoint: USER_ENDPOINTS.USER,
				accessToken: tokens.accessToken,
			});

			if (data.errorMessage) {
				throw new Error(data.errorMessage);
			}
			setUserData(data);
		}

		const authenticate = async () => {
			setIsLoading(true);
			try {
				if (!tokens.accessToken) {
					if (!tokens.refreshToken) {
						setIsLoading(false);
						navigate(ROUTES.SIGN_IN);
						return;
					}

					await refreshTokens();
					return;
				}
				else if (!isAccessTokenValid(tokens.accessToken)) {
					await refreshTokens();
					return;
				}

				await getUserData();
				setIsLoading(false);
			} catch (err: any) {
				console.log(err.message);
				if (err.message === 'Invalid refresh token!') {
					deleteTokens();
					setIsLoading(false);
					return;
				} else if (err.message === 'Unauthorized!') {
					setIsLoading(false);
					navigate(ROUTES.SIGN_IN)
					return;
				}
			}
		}

		authenticate();
	}, [tokens]);


	if (isLoading) {
		return <LoadingOverlay />
	}

	if (!userData) {
		return <Navigate to={ROUTES.SIGN_IN} />
	}

	userData.profileImagePath = `data:image/png;base64,${userData.profileImg}`;

	const context: IOutletContext = {
		userData,
		accessToken: tokens.accessToken,
	}
	return <Outlet context={context} />
}