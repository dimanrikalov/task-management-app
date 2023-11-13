import styles from './task.module.css';
import { FaCheck } from 'react-icons/fa';

type TPriority = 'Low' | 'Medium' | 'High';

export interface ITaskProps {
	title: string;
	taskImg?: string;
	priority: TPriority;
	stepsComplete: number;
	totalSteps: number;
	asigneeImg: string;
}

export const Task = ({
	title,
	taskImg,
	priority,
	totalSteps,
	asigneeImg,
	stepsComplete,
}: ITaskProps) => {
	return (
		<div className={styles.background}>
			{taskImg && (
				<div className={styles.taskImg}>
					<img src={taskImg} alt="task-img" />
				</div>
			)}
			<h4 className={styles.title}>
				Fix bug
			</h4>
			<div className={styles.footer}>
				<h5>Priority: {priority}</h5>
				<div className={styles.rightSide}>
				<div className={styles.completedSteps}>
					<FaCheck className={styles.icon} />
					<h5>
						{stepsComplete}/{totalSteps}
					</h5>
				</div>
				<div className={styles.userImg}>
					<img src={asigneeImg} alt="profile-img" />
				</div>
				</div>
			</div>
		</div>
	);
};
