import React from 'react';
import styles from './loadingOverlay.module.css';

interface ILoadingOverlayProps {
    size?: number;
    color?: string;
}

export const LoadingOverlay: React.FC<ILoadingOverlayProps> = ({ color, size }) => {
    const loaderStyle = {
        '--loader-color': color || '#1da1f2',
        width: size ? `${size}px` : '48px',
        height: size ? `${size}px` : '48px',
    };

    return (
        <div className={styles.container}>
            <span className={styles.loader} style={loaderStyle}></span>
        </div>
    );
};
