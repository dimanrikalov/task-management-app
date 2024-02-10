import styles from './homeCard.module.css';
import { BiSolidUser } from 'react-icons/bi';

interface IHomeCardProps {
	title: string;
	onClick(): void;
	subtitle: string;
	userCount: number;
}

export const HomeCard = ({
	title,
	onClick,
	subtitle,
	userCount
}: IHomeCardProps) => {
	return (
		<button onClick={onClick} className={styles.btn}>
			<div className={styles.background} style={{ height: '100%' }}>
				<div className={styles.header}>
					<h2 className={styles.title}>{title}</h2>
					<h4 className={styles.subtitle}>{subtitle}</h4>
				</div>
				<p className={styles.userCount}>
					<BiSolidUser className={styles.icon} />
					{userCount}
				</p>
			</div>
		</button>
	);
};
