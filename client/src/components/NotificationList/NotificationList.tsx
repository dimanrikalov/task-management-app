import { AiOutlineClear } from 'react-icons/ai';
import styles from './notificationList.module.css'
import { useTranslate } from '../../hooks/useTranslate';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';
import { NotificationListItem } from '../NotificationListItem/NotificationListItem';
import { EntryModificationButton } from '../Buttons/EntryModificationButton/EntryModificationButton';

interface INotificationListItem {
    id: number;
    message: string;
}

interface INotificationListProps {
    username: string;
    isLoading: boolean;
    clearNotifications(): Promise<void>;
    notifications: INotificationListItem[];
    clearNotification(notificationId: number): Promise<void>;
}

const translationPath = 'dashboard.notifications';

export const NotificationList = ({
    username,
    isLoading,
    notifications,
    clearNotification,
    clearNotifications
}: INotificationListProps) => {
    const { t } = useTranslate();
    return (
        <div className={styles.notificationsContainer}>
            <div className={styles.header}>
                <h3>{t(translationPath)}</h3>
                <EntryModificationButton
                    onClick={clearNotifications}>
                    <AiOutlineClear className={styles.icon} />
                </EntryModificationButton>
            </div>
            <div className={styles.notificationsList}>
                {
                    isLoading ?
                        <LoadingOverlay />
                        :
                        (
                            notifications.length > 0 ?
                                notifications.map(({ message, id }) =>
                                    <NotificationListItem
                                        key={id}
                                        message={message}
                                        username={username}
                                        onClick={() => clearNotification(id)}
                                    />
                                )
                                :
                                <h3 className={styles.upToDate}>
                                    You are up to date :)
                                </h3>
                        )
                }
            </div>
        </div>
    )
}