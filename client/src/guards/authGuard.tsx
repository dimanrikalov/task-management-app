import { ROUTES } from '@/router';
import { useState, useEffect } from 'react';
import { setUserData } from '@/app/userSlice';
import { setErrorMessageAsync } from '@/app/errorSlice';
import { resetTaskModalData } from '@/app/taskModalSlice';
import { CreateTaskView } from '@/views/TaskView/Task.view';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { resetAllWithoutEditProfile } from '@/app/modalsSlice';
import { METHODS, USER_ENDPOINTS, request } from '@/utils/requester';
import { EditProfileView } from '@/views/ProfileView/EditProfile.view';
import { CreateBoardView } from '@/views/CreateBoardView/CreateBoard.view';
import { deleteTokens, extractTokens, isAccessTokenValid } from '../utils';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CreateWorkspaceView } from '@/views/CreateWorkspaceView/CreateWorkspace.view';

export interface ITokens {
	accessToken: string;
	refreshToken: string;
}

export const AuthGuard = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const url = useLocation().pathname;
	const [isLoading, setIsLoading] = useState(true);
	const user = useAppSelector(state => state.user);
	const modalStates = useAppSelector(state => state.modals);
	const taskModal = useAppSelector(state => state.taskModal);

	//solves the board loading bug
	useEffect(() => {
		dispatch(resetTaskModalData());
		dispatch(resetAllWithoutEditProfile());
	}, [url]);

	useEffect(() => {
		const tokens = extractTokens();
		console.log(url);
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
			{taskModal.isModalOpen && <CreateTaskView />}
			{modalStates.showEditProfileModal && <EditProfileView />}
			{modalStates.showCreateBoardModal && <CreateBoardView />}
			{modalStates.showCreateWorkspaceModal && <CreateWorkspaceView />}
			<Outlet />
		</>
	)
}