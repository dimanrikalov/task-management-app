import styles from './errorNotification.module.css';
import { useErrorContext } from '@/contexts/error.context';

export const ErrorNotification = () => {
    const { errorMsg, showErrorMsg } = useErrorContext();

    return (
        <div
            className={styles.background}
            style={{ opacity: Number(showErrorMsg) }}
        >
            <h4>{errorMsg}</h4>
        </div>
    );
};
