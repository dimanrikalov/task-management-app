
import { useAppSelector } from '@/app/hooks';
import styles from './errorNotification.module.css';


export const ErrorNotification = () => {
    const { error } = useAppSelector(state => state);

    return (
        <div className={styles.background} style={{ opacity: Number(error.showMsg) }}>
            <h4>{error.message}</h4>
        </div>
    )
}