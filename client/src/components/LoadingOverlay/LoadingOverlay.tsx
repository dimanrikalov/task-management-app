import styles from './loadingOverlay.module.css';

export const LoadingOverlay = () => {
    return <div className={styles.container}>
        <div className={styles['lds-ring']}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
}