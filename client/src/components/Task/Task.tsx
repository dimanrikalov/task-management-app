import classNames from 'classnames';
import styles from './task.module.css';
import { FaCheck } from 'react-icons/fa';
import { Draggable } from 'react-beautiful-dnd';
import { IStep } from '@/views/CreateTaskView/CreateTask.viewmodel';

enum PRIORITY {
	'Low',
	'Medium',
	'High',
}

export interface ITask {
	id: number;
	index: number;
	steps: IStep[];
	title: string;
	progress: number;
	position: number;
	assigneeId: number;
	priority: PRIORITY;
	attachmentImgPath: string;
}

interface ITaskProps {
	task: ITask;
	index: number;
	onClick(): void;
	assigneeImgPath: string;
}

export const Task = ({ task, index, onClick, assigneeImgPath }: ITaskProps) => {
	return (
		<Draggable index={index} draggableId={`task-${task.id}`}>
			{(provided, snapshot) => (
				<div
					onClick={onClick}
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={classNames(
						styles.background,
						snapshot.isDragging && styles.isDragging
					)}
				>
					{task.attachmentImgPath && (
						<div className={styles.taskImg}>
							<img
								alt="task-img"
								src={`data:image/png;base64,${task.attachmentImgPath}`}
							/>
						</div>
					)}
					<h4 className={styles.title}>{task.title}</h4>
					<div className={styles.footer}>
						<h5>Priority: {PRIORITY[task.priority - 1]}</h5>
						<div className={styles.rightSide}>
							<div className={styles.completedSteps}>
								<FaCheck
									className={classNames(
										styles.icon,
										snapshot.isDragging && styles.invert
									)}
								/>
								<h5>{task.progress}%</h5>
							</div>
							<div className={styles.userImg}>
								<img alt="profile-img" src={assigneeImgPath} />
							</div>
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
};
