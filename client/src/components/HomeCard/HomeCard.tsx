import styles from './homeCard.module.css';
import { BiSolidUser } from 'react-icons/bi';

interface IHomeCardProps {
	title: string;
	onClick(): void;
	subtitle: string;
	userCount: number;
}

export const HomeCard = ({
	onClick,
	title,
	subtitle,
	userCount,
}: IHomeCardProps) => {
	return (
		<button className={styles.btn} onClick={onClick}>
			<div className={styles.background}>
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
