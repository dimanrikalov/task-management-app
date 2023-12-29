import { useContext } from 'react';
import styles from './errorNotification.module.css';
import { ErrorContext, IErrorContext } from '@/contexts/ErrorContext';

export const ErrorNotification = () => {
    const { error, showErrorMsg } = useContext<IErrorContext>(ErrorContext);

    return (
        <div className={styles.background} style={{ opacity: Number(showErrorMsg) }}>
            <h4>{error}</h4>
        </div>
    )
}