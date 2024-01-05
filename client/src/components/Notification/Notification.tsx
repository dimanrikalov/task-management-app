import { useAppSelector } from '@/app/hooks';
import styles from './notification.module.css';

export const Notification = () => {
    const notification = useAppSelector((state) => state.notification);

    return (
        <div
            className={styles.background}
            style={{ opacity: Number(notification.showMsg) }}
        >
            <h4>{notification.message}</h4>
        </div>
    );
};
