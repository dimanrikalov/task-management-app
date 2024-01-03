import { ROUTES } from '@/router';
import { useState, useEffect } from 'react';
import { setUserData } from '@/app/userSlice';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { METHODS, USER_ENDPOINTS, request } from '@/utils/requester';
import { deleteTokens, extractTokens, isAccessTokenValid } from '../utils';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CreateBoardModal } from '@/components/CreateBoardModal/CreateBoardModal';
import { EditProfileModal } from '@/components/EditProfileModal/EditProfileModal';
import { CreateWorkspaceModal } from '@/components/CreateWorkspaceModal/CreateWorkspaceModal';


export interface ITokens {
	accessToken: string;
	refreshToken: string;
}

export const AuthGuard = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const url = useLocation().pathname;
	const user = useAppSelector(state => state.user);
	const [isLoading, setIsLoading] = useState(true);
	const modalStates = useAppSelector(state => state.modals);

	useEffect(() => {
		const tokens = extractTokens();

		const refreshTokens = async () => {
			const data = await request({
				method: METHODS.GET,
				endpoint: USER_ENDPOINTS.REFRESH
			})

			if (data.errorMessage) {
				console.log(data.errorMessage);
				throw new Error('Invalid refresh token!');
			}
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
			dispatch(setUserData({
				accessToken: tokens.accessToken,
				data: {
					...data,
					profileImagePath: `data:image/png;base64,${data.profileImg}`
				}
			}));
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
					setIsLoading(false);
					return;
				}
				else if (!isAccessTokenValid(tokens.accessToken)) {
					await refreshTokens();
					setIsLoading(false);
					return;
				}

				await getUserData();
				setIsLoading(false);
			} catch (err: any) {
				console.log(err.message);

				switch (err.message) {
					case 'Invalid refresh token!':
						err.message = 'Invalid session. Please sign in again!';
						deleteTokens();
						setIsLoading(false);
						break;
					case 'Unauthorized':
						err.message = 'You do not have access to this resource or action!';
						setIsLoading(false);
						navigate(ROUTES.SIGN_IN)
						break;
					case 'Failed to fetch':
						err.message = 'Cannot connect to server. Please try again later!';
						break;
				}

				dispatch(setErrorMessageAsync(err.message));
			}
		}

		authenticate();
	}, [url]);

	if (isLoading) {
		return <LoadingOverlay />
	}

	if (!user.data) {
		return <Navigate to={ROUTES.SIGN_IN} />
	}

	return (
		<>
			{modalStates.showEditProfileModal && <EditProfileModal />}
			{modalStates.showCreateBoardModal && <CreateBoardModal />}
			{modalStates.showCreateWorkspaceModal && <CreateWorkspaceModal />}
			<Outlet />
		</>
	)
}