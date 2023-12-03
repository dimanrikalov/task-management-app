import styles from './task.module.css';
import { FaCheck } from 'react-icons/fa';
import { IStep } from '@/views/CreateTaskView/CreateTask.viewmodel';

enum PRIORITY {
	'Low',
	'Medium',
	'High'
}

export interface ITask {
	id: number;
	steps: IStep[];
	title: string;
	progress: number;
	priority: PRIORITY;
	attachmentImgPath: string

}

export const Task = ({ task }: { task: ITask }) => {
	return (
		<div className={styles.background}>
			{task.attachmentImgPath && (
				<div className={styles.taskImg}>
					<img src={task.attachmentImgPath} alt="task-img" />
				</div>
			)}
			<h4 className={styles.title}>
				{task.title}
			</h4>
			<div className={styles.footer}>
				<h5>Priority: {PRIORITY[task.priority - 1]}</h5>
				<div className={styles.rightSide}>
					<div className={styles.completedSteps}>
						<FaCheck className={styles.icon} />
						<h5>
							{task.progress}%
						</h5>
					</div>
					<div className={styles.userImg}>
						<img
							alt="profile-img"
							src={'/imgs/profile-img.jpeg'}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
