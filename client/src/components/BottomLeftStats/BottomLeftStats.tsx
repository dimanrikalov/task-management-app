import classNames from 'classnames';
import { RxLapTimer } from 'react-icons/rx';
import { HomeStat } from '../HomeStat/HomeStat';
import styles from './bottomLeftStats.module.css';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { MdOutlinePendingActions } from 'react-icons/md';
import { useUserStatsContext } from '../../contexts/userStats.context';

export const BottomLeftStats = () => {
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
					title={'Steps Completed'}
					value={userStats.stepsCompleted}
					icon={<FaRegSquareCheck className={styles.icon} />}
				/>
			</div>
			<div className={classNames(styles.card, styles.tasksCompleted)}>
				<HomeStat
					isLoading={isLoading}
					title={'Tasks Completed'}
					value={userStats.completedTasksCount}
					icon={<FaRegCircleCheck className={styles.icon} />}
				/>
			</div>
			<div className={classNames(styles.card, styles.pendingTasks)}>
				<HomeStat
					isLoading={isLoading}
					title={'Pending Tasks'}
					value={userStats.pendingTasksCount}
					icon={<MdOutlinePendingActions className={styles.icon} />}
				/>
			</div>
			<div className={classNames(styles.card, styles.timeSpent)}>
				<HomeStat
					value={timeSpent}
					title={'Time Spent On Tasks'}
					isLoading={isLoading}
					icon={<RxLapTimer className={styles.icon} />}
				/>
			</div>
		</div>
	);
};
