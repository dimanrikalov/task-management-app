import { createContext, useContext, useEffect, useState } from 'react';
import { INotification, useFetchNotifications } from '@/hooks/useFetchNotifications';

interface INotificationContext {
	isLoading: boolean;
	notificationMsg: string;
	showNotificationMsg: boolean;
	notifications: INotification[]
	showNotification(message: string): void;
}

const NotificationContext = createContext<INotificationContext>({
	isLoading: true,
	notifications: [],
	notificationMsg: '',
	showNotificationMsg: false,
	showNotification: () => { }
});

export const useNotificationContext = () =>
	useContext<INotificationContext>(NotificationContext);

export const NotificationContextProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const { notifications, isLoading } = useFetchNotifications();
	const [notificationMsg, setNotificationMsg] = useState<string>('');
	const [showNotificationMsg, setShowNotificationMsg] =
		useState<boolean>(false);

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

	const data = {
		isLoading,
		notifications,
		notificationMsg,
		showNotification,
		showNotificationMsg
	};

	return (
		<NotificationContext.Provider value={data}>
			{children}
		</NotificationContext.Provider>
	);
};
