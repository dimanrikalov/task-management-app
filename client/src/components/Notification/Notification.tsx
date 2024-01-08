import styles from './notification.module.css';
import { useNotificationContext } from '@/contexts/notification.context';

export const Notification = () => {
    const { notificationMsg, showNotificationMsg } = useNotificationContext();

    return (
        <div
            className={styles.background}
            style={{ opacity: Number(showNotificationMsg) }}
        >
            <h4>{notificationMsg}</h4>
        </div>
    );
};
