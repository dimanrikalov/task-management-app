import classNames from 'classnames';
import { RxLapTimer } from 'react-icons/rx';
import { HomeStat } from '../HomeStat/HomeStat';
import styles from './bottomLeftStats.module.css';
import { HiOutlineDocument } from 'react-icons/hi';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { useTranslate } from '../../hooks/useTranslate';
import { MdOutlinePendingActions } from 'react-icons/md';
import { useUserStatsContext } from '../../contexts/userStats.context';

const basePath = 'dashboard.stats';

const translationPaths = {
	taskify: 'taskify',
	stats: {
		timeSpent: `${basePath}.timeSpent`,
		boardsCount: `${basePath}.boardsCount`,
		pendingTasks: `${basePath}.pendingTasks`,
		tasksCompleted: `${basePath}.tasksCompleted`,
	}
}

export const BottomLeftStats = () => {
	const { t } = useTranslate();
	const { userStats, isLoading } = useUserStatsContext();
	const timeSpent = `
        ${userStats.hoursSpent < 10 ? 0 : ''}${userStats.hoursSpent} : 
        ${userStats.minutesSpent < 10 ? 0 : ''}${userStats.minutesSpent}
    `;

	return (
		<div className={styles.background}>
			<div className={classNames(styles.card, styles.stepsCompleted)}>
				<HomeStat
					isLoading={isLoading}
					title={t(translationPaths.stats.boardsCount)}
					value={userStats.boardsCount}
					icon={<HiOutlineDocument className={styles.icon} />}
				/>
			</div>
			<div className={classNames(styles.card, styles.tasksCompleted)}>
				<HomeStat
					isLoading={isLoading}
					title={t(translationPaths.stats.tasksCompleted)}
					value={userStats.completedTasksCount}
					icon={<FaRegCircleCheck className={styles.icon} />}
				/>
			</div>
			<div className={classNames(styles.card, styles.pendingTasks)}>
				<HomeStat
					isLoading={isLoading}
					title={t(translationPaths.stats.pendingTasks)}
					value={userStats.pendingTasksCount}
					icon={<MdOutlinePendingActions className={styles.icon} />}
				/>
			</div>
			<div className={classNames(styles.card, styles.timeSpent)}>
				<HomeStat
					value={timeSpent}
					title={t(translationPaths.stats.timeSpent)}
					isLoading={isLoading}
					icon={<RxLapTimer className={styles.icon} />}
				/>
			</div>
		</div>
	);
};
