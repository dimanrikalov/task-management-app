import styles from './homeHeader.module.css';

interface IHomeHeaderProps {
	date: string;
	username: string
	profileImgPath: string;
}

export const HomeHeader = ({
	date,
	username,
	profileImgPath
}: IHomeHeaderProps) => {
	return (
		<div className={styles.header}>
			<h1 className={styles.dashboard}>Dashboard</h1>
			<div className={styles.rightSide}>
				<div className={styles.userData}>
					<div className={styles.profileImgContainer}>
						<img alt="profile-img" src={profileImgPath} />
					</div>
					<p
						className={styles.fullName}
					>{username}</p>
				</div>
				<h4 className={styles.date}>{date}</h4>
			</div>
		</div>
	);
};
