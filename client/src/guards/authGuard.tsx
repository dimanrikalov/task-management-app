import { ROUTES } from '@/router';
import { useState, useEffect } from 'react';
import { setUserData } from '@/app/userSlice';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { METHODS, USER_ENDPOINTS, request } from '@/utils/requester';
import { EditProfileView } from '@/views/ProfileView/EditProfile.view';
import { CreateTaskView } from '@/views/CreateTaskView/CreateTask.view';
import { CreateBoardView } from '@/views/CreateBoardView/CreateBoard.view';
import { deleteTokens, extractTokens, isAccessTokenValid } from '../utils';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { CreateWorkspaceView } from '@/views/CreateWorkspaceView/CreateWorkspace.view';

export interface ITokens {
	accessToken: string;
	refreshToken: string;
}


export const AuthGuard = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const user = useAppSelector(state => state.user);
	const modalStates = useAppSelector(state => state.modals);
	const [tokens, setTokens] = useState<ITokens>(extractTokens());
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
	}, [tokens]);


	if (isLoading) {
		return <LoadingOverlay />
	}

	if (!user.data) {
		return <Navigate to={ROUTES.SIGN_IN} />
	}

	// const context: IOutletContext = {
	// 	userData,
	// 	accessToken: tokens.accessToken,
	// }
	return <>
		{/* <CreateTaskView /> */}
		{modalStates.showEditProfileModal && <EditProfileView />}
		{modalStates.showCreateBoardModal && <CreateBoardView />}
		{modalStates.showCreateWorkspaceModal && <CreateWorkspaceView />}

		<Outlet />
	</>
}