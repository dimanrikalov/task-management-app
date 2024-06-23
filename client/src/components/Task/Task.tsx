import React from 'react';
import classNames from 'classnames';
import styles from './task.module.css';
import { FaCheck } from 'react-icons/fa';
import { Draggable } from 'react-beautiful-dnd';
import { IStep } from '../../hooks/useStepsOperations';
import { useTranslate } from '../../hooks/useTranslate';

enum PRIORITY {
	'Low',
	'Medium',
	'High'
}

export interface ITask {
	id: number;
	index: number;
	steps: IStep[];
	title: string;
	effort: number;
	progress: number;
	position: number;
	assigneeId: number;
	image: File | null;
	hoursSpent: number;
	priority: PRIORITY;
	description: string;
	minutesSpent: number;
	estimatedHours: number;
	estimatedMinutes: number;
	attachmentImgPath: string;
}

interface ITaskProps {
	task: ITask;
	index: number;
	onClick(): void;
	hasDragStarted: boolean;
	assigneeImgPath: string;
}
const basePath = 'taskModal';
const translationPaths = {
	low: `${basePath}.low`,
	high: `${basePath}.high`,
	medium: `${basePath}.medium`,
	priority: `${basePath}.priority`,
}

export const Task = React.memo(
	({ task, index, onClick, hasDragStarted, assigneeImgPath }: ITaskProps) => {
		const { t } = useTranslate();
		const priorityKey = PRIORITY[task.priority - 1].toLowerCase() as keyof typeof translationPaths;
		const priority = t(translationPaths[priorityKey]);

		return (
			<Draggable
				index={index}
				draggableId={`task-${task.id}`}
				isDragDisabled={hasDragStarted}
			>
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
									src={task.attachmentImgPath}
								/>
							</div>
						)}
						<h4 className={styles.title}>{task.title}</h4>
						<div className={styles.footer}>
							<h5>{t(translationPaths.priority)}: {priority}</h5>
							<div className={styles.rightSide}>
								<div className={styles.completedSteps}>
									<FaCheck
										className={classNames(
											styles.icon,
											snapshot.isDragging && styles.invert
										)}
									/>
									<h5 className={styles.progress}>
										{task.progress}%
									</h5>
								</div>
								<div className={styles.userImg}>
									<img
										alt="profile-img"
										src={assigneeImgPath}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
			</Draggable>
		);
	},
	// Use areEqual function to compare props and prevent re-rendering
	(prevProps, nextProps) => {
		return (
			prevProps.task === nextProps.task &&
			prevProps.index === nextProps.index &&
			prevProps.hasDragStarted === nextProps.hasDragStarted &&
			prevProps.assigneeImgPath === nextProps.assigneeImgPath
		);
	}
);
