import styles from './notificationList.module.css'
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';
import { NotificationListItem } from '../NotificationListItem/NotificationListItem';

interface INotificationListItem {
    id: number;
    message: string;
}

interface INotificationListProps {
    isLoading: boolean;
    notifications: INotificationListItem[]
}

export const NotificationList = ({ isLoading, notifications }: INotificationListProps) => {
    return (
        <div className={styles.notificationsContainer}>
            <div className={styles.header}>
                <h3>Notifications</h3>
            </div>
            <div className={styles.notificationsList}>
                {
                    isLoading ?
                        <LoadingOverlay />
                        :
                        (
                            notifications.length > 0 ?
                                notifications.map(({ message, id }) =>
                                    <NotificationListItem key={id} message={message} />
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