import { useState, useEffect } from 'react';
import { extractTokens, isAccessTokenValid } from '../utils';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
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

	const refreshTokens = async () => {
		await fetch(`${import.meta.env.VITE_SERVER_URL}/users/refresh`, {
			credentials: 'include'
		});
		setTokens(extractTokens());
	}

	const getUserData = async () => {
		try {
			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/user`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`
				}
			});
			const data = await res.json();
			setUserData(data);

		} catch (err: any) {
			console.log(err.message);
		}
	}

	useEffect(() => {
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
				}
				else if (!isAccessTokenValid(tokens.accessToken)) {
					await refreshTokens();
				}

				await getUserData();
				setIsLoading(false);
			} catch (err: any) {
				console.log(err.message);
				setIsLoading(false);
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

	const context: IOutletContext = {
		userData,
		accessToken: tokens.accessToken,
	}
	return <Outlet context={context} />
}