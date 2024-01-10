
import { ROUTES } from '../router';
import { getTokens } from '../utils';
import { Navigate, Outlet } from 'react-router-dom';

export const UnAuthGuard = () => {
    const { accessToken, refreshToken } = getTokens();

    if (accessToken || refreshToken) {
        return <Navigate to={ROUTES.DASHBOARD} />;
    }

    return <Outlet />;
};
