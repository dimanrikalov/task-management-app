import { FaXmark } from 'react-icons/fa6'
import styles from './notificationListItem.module.css'

interface INotificationListItemProps {
    message: string;
    username: string;
    onClick(): Promise<void>;
}

export const NotificationListItem = ({ username, message, onClick }: INotificationListItemProps) => {

    return (
        <div className={styles.notification}>
            <button
                onClick={onClick}
                className={styles.clearButton}
            >
                <FaXmark size={18} />
            </button>
            <p className={styles.message}>{message.replace(username, 'you')}</p>
        </div>
    )
}