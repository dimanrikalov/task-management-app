import React from 'react';
import styles from './homeStat.module.css';
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay';

interface IHomeStatProps {
	title: string;
	isLoading: boolean;
	icon: React.ReactNode;
	value: number | string;
}

export const HomeStat = ({ icon, title, value, isLoading }: IHomeStatProps) => {
	return (
		<div className={styles.background}>
			<h3>{title}</h3>
			<div className={styles.bottom}>
				{icon}
				<div className={styles.value}>
					{isLoading ? (
						<LoadingOverlay color="#fff" />
					) : (
						<span>{value}</span>
					)}
				</div>
			</div>
		</div>
	);
};
