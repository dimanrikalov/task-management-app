import styles from './column.module.css';
import { ITask, Task } from '../Task/Task';
import { Droppable } from 'react-beautiful-dnd';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';


interface IColumnProps {
	id: number;
	title: string;
	tasks: ITask[];
	callForRefresh(): void;
	onClick(columnId: number): void;
}

export const Column = ({ id, title, onClick, tasks }: IColumnProps) => {
	return (
		<div className={styles.background}>
			<h2 className={styles.title}>{title}</h2>
			<Droppable
				droppableId={id.toString()}
			>
				{
					(provided) => (
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
										/>
									))}
							</div>


							<span style={{ display: 'none' }}>
								{provided.placeholder}
							</span>
						</>
					)
				}
			</Droppable>
			<div className={styles.addTask}>
				<IntroButton
					reverse={true}
					message={'Add task'}
					onClick={() => onClick(id)}
				/>
			</div>
		</div>
	);
};
