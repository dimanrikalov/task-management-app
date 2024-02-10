import { ROUTES } from '../router';
import { Navigate, Outlet } from 'react-router-dom';
import { useModalsContext } from '../contexts/modals.context';
import { IUserData, useUserContext } from '../contexts/user.context';
import { LoadingOverlay } from '../components/LoadingOverlay/LoadingOverlay';
import { EditProfileModal } from '../components/EditProfileModal/EditProfileModal';
import { CreateBoardModal } from '../components/CreateBoardModal/CreateBoardModal';
import { CreateWorkspaceModal } from '../components/CreateWorkspaceModal/CreateWorkspaceModal';

export interface IOutletContext {
	data: IUserData;
	accessToken: string;
}
export interface ITokens {
	accessToken: string;
	refreshToken: string;
}

export const AuthGuard = () => {
	const { modalsState } = useModalsContext();
	const { data: user, accessToken, isLoadingData } = useUserContext();

	if (isLoadingData) {
		return <LoadingOverlay />
	}

	if (!user || !accessToken) {
		return <Navigate to={ROUTES.SIGN_IN} />;
	}

	return (
		<>
		
			{modalsState.showEditProfileModal && <EditProfileModal />}
			{modalsState.showCreateBoardModal && <CreateBoardModal />}
			{modalsState.showCreateWorkspaceModal && <CreateWorkspaceModal />}
			<Outlet />
		</>
	);
};
