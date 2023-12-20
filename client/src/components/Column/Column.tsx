import styles from './column.module.css';
import { ITask, Task } from '../Task/Task';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { IUser } from '../AddColleagueInput/AddColleagueInput';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';

interface IColumnProps {
	id: number;
	index: number;
	title: string;
	tasks: ITask[];
	users: IUser[];
	onClick(columnId: number): void;
}

export const Column = ({
	id,
	index,
	users,
	title,
	onClick,
	tasks,
}: IColumnProps) => {
	return (
		<Draggable
			index={index}
			draggableId={`column-${id}`} // Unique draggableId for columns
		>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className={styles.background}
				>
					<h2 className={styles.title} {...provided.dragHandleProps}>
						{title}
					</h2>
					<Droppable
						droppableId={`column-${id}`} // Unique droppableId for columns
						type="task"
					>
						{(provided) => (
							<>
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
									className={styles.tasksContainer}
								>
									{tasks &&
										tasks.map((task, index) => (
											<Task
												task={task}
												index={index}
												key={task.id.toString()}
												onClick={() => onClick(id)}
												assigneeImgPath={
													users.find(
														(user) =>
															user.id ===
															task.assigneeId
													)?.profileImagePath!
												}
											/>
										))}
									{provided.placeholder}
								</div>
							</>
						)}
					</Droppable>
					<div className={styles.addTask}>
						<IntroButton
							reverse={true}
							message={'Add task'}
							onClick={() => onClick(id)}
						/>
					</div>
				</div>
			)}
		</Draggable>
	);
};
