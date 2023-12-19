import { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
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
			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/refresh`, {
				credentials: 'include'
			});
			if (res.status === 400) {
				throw new Error('Invalid refresh token!');
			}
			setTokens(extractTokens());
		}

		const getUserData = async () => {
			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/user`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`
				}
			});
			if (res.status === 401) {
				throw new Error('Unauthorized!')
			}
			const data = await res.json();
			setUserData(data);
		}

		const authenticate = async () => {
			setIsLoading(true);
			try {
				if (!tokens.accessToken) {
					if (!tokens.refreshToken) {
						setIsLoading(false);
						navigate('/auth/sign-in');
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
					navigate('/auth/sign-in')
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
		return <Navigate to={'/auth/sign-in'} />
	}

	userData.profileImagePath = `data:image/png;base64,${userData.profileImg}`;

	const context: IOutletContext = {
		userData,
		accessToken: tokens.accessToken,
	}
	return <Outlet context={context} />
}