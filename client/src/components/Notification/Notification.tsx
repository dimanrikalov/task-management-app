import classNames from 'classnames';
import styles from './notification.module.css';
import { useUserContext } from '@/contexts/user.context';
import { useErrorContext } from '@/contexts/error.context';
import { useNotificationContext } from '../../contexts/notification.context';

export const Notification = () => {
	const { data } = useUserContext();
	const { showErrorMsg } = useErrorContext();
	const { notificationMsg, showNotificationMsg, } = useNotificationContext();
	const message = data?.username ?
		notificationMsg.replace(data.username, 'you') : notificationMsg;

	return (
		<div
			className={classNames(
				styles.background,
				showErrorMsg && styles.moveToLeft
			)}
			style={{ opacity: Number(showNotificationMsg) }}
		>
			<h4>{message}</h4>
		</div>
	);
};
