import { ROUTES } from '../router';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '@/contexts/user.context';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';

export const UnAuthGuard = () => {
	const { accessToken, data: user, isLoadingData } = useUserContext();

	if (isLoadingData) {
		return <LoadingOverlay />
	}

	if (user || accessToken) {
		return <Navigate to={ROUTES.DASHBOARD} />;
	}

	return <Outlet />;
};
