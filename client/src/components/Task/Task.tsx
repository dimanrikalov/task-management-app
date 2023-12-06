import { useDrag } from 'react-dnd';
import classNames from 'classnames';
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
	columnId: number;
	progress: number;
	priority: PRIORITY;
	attachmentImgPath: string

}

export const Task = ({ task, columnId }: { columnId: number, task: ITask }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'task',
		item: {
			columnId,
			id: task.id,
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		})
	}));

	return (
		<div
			ref={drag}
			className={classNames(styles.background, isDragging && styles.dragging)}>
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
}
