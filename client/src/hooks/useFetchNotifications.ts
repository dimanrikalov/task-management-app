import { useEffect, useState } from 'react';
import { useUserContext } from '@/contexts/user.context';
import { useErrorContext } from '@/contexts/error.context';
import { request, NOTIFICATIONS_ENDPOINTS, METHODS } from '@/utils/requester';

export interface INotification {
	id: number;
	userId: number;
	message: string;
	timestamp: Date;
}

export const useFetchNotifications = () => {
	const { showError } = useErrorContext();
	const { accessToken } = useUserContext();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [notifications, setNotifications] = useState<INotification[]>([]);

	useEffect(() => {
		if (!accessToken) return;

		const fetchNotifications = async () => {
			setIsLoading(true);
			try {
				const data = await request({
					accessToken,
					method: METHODS.GET,
					endpoint: NOTIFICATIONS_ENDPOINTS.BASE
				});

				if (data.errorMessage) {
					throw new Error(data.errorMessage);
				}

				setNotifications(data);
			} catch (err: any) {
				showError(err.message);
				console.log(err.message);
			}
			setIsLoading(false);
		};

		fetchNotifications();
	}, [accessToken]);

	return {
		isLoading,
		notifications,
		setNotifications
	};
};
