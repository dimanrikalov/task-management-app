import { FaXmark } from 'react-icons/fa6'
import styles from './notificationListItem.module.css'

interface INotificationListItemProps {
    message: string;
}

export const NotificationListItem = ({ message }: INotificationListItemProps) => {
    return (
        <div className={styles.notification}>
            <button
                onClick={() => { }}
                className={styles.clearButton}
            >
                <FaXmark size={18} />
            </button>
            <p className={styles.message}>{message}</p>
        </div>
    )
}