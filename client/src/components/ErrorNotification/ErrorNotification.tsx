import styles from './errorNotification.module.css';

interface IErrorNotificationProps {
    errorMessage: string;
    opacity: number;
}

export const ErrorNotification = ({ errorMessage, opacity }: IErrorNotificationProps) => {
    return (
        <div className={styles.background} style={{ opacity }}>
            <h4>{errorMessage}</h4>
        </div>
    )
}