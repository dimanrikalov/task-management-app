import { ROUTES } from '@/router';
import { extractTokens } from '@/utils';
import { Navigate, Outlet } from 'react-router-dom';

export const UnAuthGuard = () => {
    const { accessToken, refreshToken } = extractTokens();

    if (accessToken || refreshToken) {
        return <Navigate to={ROUTES.DASHBOARD} />;
    }

    return <Outlet />;
};
