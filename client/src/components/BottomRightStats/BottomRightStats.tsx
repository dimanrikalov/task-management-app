import classNames from 'classnames';
import { BiColumns } from 'react-icons/bi';
import { HomeStat } from '../HomeStat/HomeStat';
import { LuMessageSquare } from 'react-icons/lu';
import styles from './bottomRightStats.module.css';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { useTranslate } from '../../hooks/useTranslate';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { useUserStatsContext } from '../../contexts/userStats.context';

const basePath = 'dashboard.stats';

const translationPaths = {
	taskify: 'taskify',
	stats: {
		columnsCount: `${basePath}.columnsCount`,
		messagesCount: `${basePath}.messagesCount`,
		stepsCompleted: `${basePath}.stepsCompleted`,
		workspacesCount: `${basePath}.workspacesCount`,
	}
}

export const BottomRightStats = () => {
	const { t } = useTranslate();
	const { userStats, isLoading } = useUserStatsContext();

	return (
		<div className={styles.background}>
			<div className={classNames(styles.card, styles.workspacesCreated)}>
				<HomeStat
					title={t(translationPaths.stats.workspacesCount)}
					isLoading={isLoading}
					value={userStats.workspacesCount}
					icon={<MdOutlineLibraryBooks className={styles.icon} />}
				/>
			</div>
			<div className={classNames(styles.card, styles.boardsCreated)}>
				<HomeStat
					title={t(translationPaths.stats.stepsCompleted)}
					isLoading={isLoading}
					value={userStats.stepsCompleted}
					icon={<FaRegSquareCheck className={styles.icon} />}
				/>
			</div>
			<div className={classNames(styles.card, styles.messages)}>
				<HomeStat
					title={t(translationPaths.stats.messagesCount)}
					isLoading={isLoading}
					value={userStats.messagesCount}
					icon={<LuMessageSquare className={styles.icon} />}
				/>
			</div>
			<div className={classNames(styles.card, styles.columns)}>
				<HomeStat
					title={t(translationPaths.stats.columnsCount)}
					isLoading={isLoading}
					value={userStats.columnsCount}
					icon={<BiColumns className={styles.icon} />}
				/>
			</div>
		</div>
	);
};
