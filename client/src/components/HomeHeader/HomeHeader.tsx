import { MdLanguage } from 'react-icons/md';
import styles from './homeHeader.module.css';
import { useTranslate } from '../../hooks/useTranslate';

interface IHomeHeaderProps {
	date: string;
	username: string
	profileImgPath: string;
}

const translationPaths = {
	taskify: 'taskify',
	dashboard: {
		title: 'dashboard.title'
	}
}

export const HomeHeader = ({
	date,
	username,
	profileImgPath
}: IHomeHeaderProps) => {
	const { t, changeLanguage } = useTranslate();

	return (
		<div className={styles.header}>
			<h1 className={styles.dashboard}>
				{t(translationPaths.dashboard.title)}
				</h1>
			<div className={styles.rightSide}>
				<div className={styles.userData}>
					<div className={styles.profileImgContainer}>
						<img alt="profile-img" src={profileImgPath} />
					</div>
					<p
						className={styles.fullName}
					>{username}</p>
					<MdLanguage
						onClick={changeLanguage}
						className={styles.translationButton}
					/>
				</div>
				<h4 className={styles.date}>{date}</h4>
			</div>
		</div>
	);
};
