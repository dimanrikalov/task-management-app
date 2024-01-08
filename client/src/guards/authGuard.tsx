import { ROUTES } from '@/router';
import { useState, useEffect } from 'react';
import { useErrorContext } from '@/contexts/error.context';
import { useModalsContext } from '@/contexts/modals.context';
import { IUserData, useUserContext } from '@/contexts/user.context';
import { METHODS, USER_ENDPOINTS, request } from '@/utils/requester';
import { deleteTokens, extractTokens, isAccessTokenValid } from '../utils';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CreateBoardModal } from '@/components/CreateBoardModal/CreateBoardModal';
import { EditProfileModal } from '@/components/EditProfileModal/EditProfileModal';
import { CreateWorkspaceModal } from '@/components/CreateWorkspaceModal/CreateWorkspaceModal';

export interface IOutletContext {
    data: IUserData;
    accessToken: string;
}
export interface ITokens {
    accessToken: string;
    refreshToken: string;
}

export const AuthGuard = () => {
    const navigate = useNavigate();
    const url = useLocation().pathname;
    const { showError } = useErrorContext();
    const { modalsState } = useModalsContext();
    const [isLoading, setIsLoading] = useState(true);
    const { data: user, setUserData } = useUserContext();

    useEffect(() => {
        const tokens = extractTokens();

        const refreshTokens = async () => {
            const data = await request({
                method: METHODS.GET,
                endpoint: USER_ENDPOINTS.REFRESH
            });

            if (data.errorMessage) {
                console.log(data.errorMessage);
                throw new Error('Invalid refresh token!');
            }
        };

        const getUserData = async () => {
            const data = await request({
                method: METHODS.GET,
                endpoint: USER_ENDPOINTS.USER,
                accessToken: tokens.accessToken
            });

            if (data.errorMessage) {
                throw new Error(data.errorMessage);
            }
            setUserData({
                accessToken: tokens.accessToken,
                data: {
                    ...data,
                    profileImagePath: `data:image/png;base64,${data.profileImg}`
                }
            })
        };

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
                } else if (!isAccessTokenValid(tokens.accessToken)) {
                    await refreshTokens();
                    setIsLoading(false);
                    return;
                }

                await getUserData();
                setIsLoading(false);
            } catch (err: any) {
                console.log(err.message);

                switch (err.message) {
                    case 'Invalid JWT token!':
                        err.message = 'Invalid session. Please sign in again!';
                        deleteTokens();
                        setIsLoading(false);
                        navigate(ROUTES.SIGN_IN);
                        break;
                    case 'Unauthorized':
                        err.message =
                            'You do not have access to this resource or action!';
                        setIsLoading(false);
                        navigate(ROUTES.SIGN_IN);
                        break;
                    case 'Failed to fetch':
                        err.message =
                            'Cannot connect to server. Please try again later!';
                        break;
                }

                showError(err.message);
            }
        };

        authenticate();
    }, [url]);

    if (isLoading) {
        return <LoadingOverlay />;
    }

    if (!user) {
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
