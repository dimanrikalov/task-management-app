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
			<h4>{title}</h4>
			{taskImg && (
				<div className={styles.taskImg}>
					<img src={taskImg} alt="task-img" />
				</div>
			)}
			<div className={styles.footer}>
				<h4>Priority: {priority}</h4>
				<div className={styles.completedSteps}>
					<FaCheck className={styles.icon} />
					<h4>
						{stepsComplete}/{totalSteps}
					</h4>
				</div>
				<div className={styles.userImg}>
					<img src={asigneeImg} alt="profile-img" />
				</div>
			</div>
		</div>
	);
};
