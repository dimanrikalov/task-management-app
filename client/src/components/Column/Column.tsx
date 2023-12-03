import styles from './column.module.css';
import { ITask, Task } from '../Task/Task';
import { IntroButton } from '../Buttons/IntroButton/IntroButton';

interface IColumnProps {
	id: number;
	title: string;
	tasks: ITask[];
	onClick(columnId: number): void;
}

export const Column = ({ id, title, onClick, tasks }: IColumnProps) => {
	return (
		<div className={styles.background}>
			<h2 className={styles.title}>{title}</h2>
			<div className={styles.tasksContainer}>
				{tasks &&
					tasks.map((task) => (
						<Task
							task={task}
							key={task.id}
						/>
					))}

				<IntroButton
					message={'Add task'}
					onClick={() => onClick(id)}
				/>

			</div>
		</div>
	);
};
