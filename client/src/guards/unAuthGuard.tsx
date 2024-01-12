import { ROUTES } from '../router';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '@/contexts/user.context';

export const UnAuthGuard = () => {
	const { accessToken, data: user } = useUserContext();

	if (user || accessToken) {
		return <Navigate to={ROUTES.DASHBOARD} />;
	}

	return <Outlet />;
};
