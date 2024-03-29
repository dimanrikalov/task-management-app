import { useUserContext } from './user.context';
import { useErrorContext } from './error.context';
import { createContext, useContext, useEffect, useState } from 'react';
import { METHODS, NOTIFICATIONS_ENDPOINTS, request } from '@/utils/requester';
import { SOCKET_EVENTS, useSocketConnection } from './socketConnection.context';
import { INotification, useFetchNotifications } from '@/hooks/useFetchNotifications';

interface INotificationContext {
	isLoading: boolean;
	callForRefresh(): void;
	notificationMsg: string;
	showNotificationMsg: boolean;
	notifications: INotification[]
	deleteNotifications(): Promise<void>;
	showNotification(message: string): void;
	deleteNotification(notificationId: number): Promise<void>;
}

const NotificationContext = createContext<INotificationContext>({
	isLoading: true,
	notifications: [],
	notificationMsg: '',
	callForRefresh: () => { },
	showNotificationMsg: false,
	showNotification: () => { },
	deleteNotification: async () => { },
	deleteNotifications: async () => { }
});

export const useNotificationContext = () =>
	useContext<INotificationContext>(NotificationContext);

export const NotificationContextProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const { showError } = useErrorContext();
	const { socket } = useSocketConnection();
	const { accessToken } = useUserContext();
	const [notificationMsg, setNotificationMsg] = useState<string>('');
	const { notifications, isLoading, setNotifications, callForRefresh } = useFetchNotifications();
	const [showNotificationMsg, setShowNotificationMsg] =
		useState<boolean>(false);

	useEffect(() => {
		if (!socket) return;

		const handleNotification = (data: any) => {
			callForRefresh();
			showNotification(data.message)
		}

		socket.on(SOCKET_EVENTS.NOTIFICATION, handleNotification)

		return () => {
			socket.off(SOCKET_EVENTS.NOTIFICATION, handleNotification);
		};

	}, [socket]);

	useEffect(() => {
		if (!showNotificationMsg) return;
		const timeout = setTimeout(() => {
			setShowNotificationMsg(false);
		}, 5000);

		return () => clearTimeout(timeout);
	}, [showNotificationMsg]);

	const showNotification = (message: string) => {
		setNotificationMsg(message);
		setShowNotificationMsg(true);
	};

	const deleteNotification = async (notificationId: number) => {
		try {
			const res = await request({
				accessToken,
				method: METHODS.DELETE,
				endpoint: NOTIFICATIONS_ENDPOINTS.EDIT(notificationId),
			});

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

			setNotifications((prev) =>
				prev.filter((notification) => notification.id !== notificationId)
			);
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
	}

	const deleteNotifications = async () => {
		if (notifications.length === 0) {
			return;
		}

		try {
			const res = await request({
				accessToken,
				method: METHODS.DELETE,
				endpoint: NOTIFICATIONS_ENDPOINTS.BASE,
			});

			if (res.errorMessage) {
				throw new Error(res.errorMessage);
			}

			setNotifications([]);
		} catch (err: any) {
			console.log(err.message);
			showError(err.message);
		}
	}

	const data = {
		isLoading,
		notifications,
		callForRefresh,
		notificationMsg,
		showNotification,
		deleteNotification,
		deleteNotifications,
		showNotificationMsg
	};

	return (
		<NotificationContext.Provider value={data}>
			{children}
		</NotificationContext.Provider>
	);
};
